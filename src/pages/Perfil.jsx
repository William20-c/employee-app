import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const Perfil = () => {
    const { user, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [empleado, setEmpleado] = useState();
    const [form, setForm] = useState({ codigo: "", resumen: "" });
    const [formUpdate, setFormUpdate] = useState({ salario: 0, fecha_ingreso: "" });
    const [mensaje, mensajeDatos] = useState('Buscando solicitudes...');
    const [solicitudes, setSolicitudes] = useState([]);
    const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        }
        obtenerPerfil();
    }, [navigate]);



    const obtenerPerfil = async () => {
        const token = localStorage.getItem("token");
        const resp = await fetch(
            `http://localhost:3000/api/empleados/${user.id}`,
            {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (resp.ok) {
            const data = await resp.json();
            setEmpleado(data.empleado);
            localStorage.setItem("perfil",JSON.stringify(data.empleado));
            getSolicitudes(data.empleado.id);
        }else{
            if(resp.status === 400){
                localStorage.removeItem("token"); 
                navigate("/");
                return;
            }
        }

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormUpdate({ ...formUpdate, [name]: value });
    };

    const formatFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toISOString().split("T")[0];
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const resp = await fetch(`http://localhost:3000/api/empleados`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                salario: formUpdate.salario,
                fecha_ingreso: formUpdate.fecha_ingreso,
                correo: user?.correo,
                nombre:user?.nombre
                }),
            });

            if (resp.ok) {
                Swal.fire("Actualización exitosa", "Los datos han sido actualizados", "success");
                setFormUpdate({ salario: null, fecha_ingreso: "" });
                setIsUpdateModalOpen(false);
                obtenerPerfil();
            } else {
                Swal.fire("Error", "No se pudo actualizar la información", "error");
                setIsUpdateModalOpen(false);
            }
        } catch (error) {
        Swal.fire("Error", "Ocurrió un error en el servidor", "error");
        setIsUpdateModalOpen(false);
        }
    };

    const getSolicitudes = async (id) => {
        setLoadingSolicitudes(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/solicitud/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setSolicitudes(data);
        } else {
            Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
        }
        setLoadingSolicitudes(false);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem("token");;
        const resp = await fetch("http://localhost:3000/api/solicitud", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_empleado: empleado?.id, 
                codigo: form.codigo,
                resumen: form.resumen,
            }),
        });

        if (resp.ok) {
            Swal.fire("Solicitud enviada", "Tu solicitud ha sido registrada", "success");
            setForm({ codigo: "", resumen: "" }); 
            setIsModalOpen(false); 
            getSolicitudes(empleado?.id);
        } else {
            Swal.fire("Error", "No se pudo enviar la solicitud", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Ocurrió un error en el servidor", "error");
    }
  };

  return (
    <div className="container mt-5">
        <div className="text-end">
          <button
            className="btn btn-info me-2"
            onClick={() => logout()}
          >
            Cerrar sesión
          </button>
        </div>
        <h2 className="text-center mb-4">Perfil del Empleado</h2>
        <div className="row">
            <div className="col-md-6">
                <div className="card shadow">
                    <div className="card-body">
                        <h5 className="card-title text-primary">Información del Empleado</h5>
                        <p><strong>Nombre:</strong> {user?.nombre}</p>
                        <p><strong>Correo:</strong> {user?.correo}</p>
                        <p><strong>Salario:</strong> {empleado?.salario ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(empleado?.salario) : 0}</p>
                        <p><strong>Fecha de Ingreso:</strong> {empleado?.fecha_ingreso ? formatFecha(empleado?.fecha_ingreso) : ''}</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mt-3 w-100">
                        Crear Solicitud
                        </button>
                        <button onClick={() => setIsUpdateModalOpen(true)} className="btn btn-secondary mt-3 w-100">
                        Actualizar Salario y Fecha
                        </button>
                    </div>
                </div>
            </div>

        
            <div className="col-md-6">
                <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title text-secondary">Solicitudes</h5>
                    {solicitudes.length > 0 ? (
                        <div className="mt-4">
                            <div className="card-deck">
                                {loadingSolicitudes ? (
                                <p>Cargando solicitudes...</p>
                                ) : (
                                solicitudes.map((solicitud) => (
                                    <div key={solicitud.id} className="card mb-2">
                                        <div className="card-body">
                                            <h5 className="card-title">Solicitud {solicitud.codigo}</h5>
                                            <p className="card-text">
                                                <strong>Resumen:</strong><br/> 
                                                {solicitud.resumen}
                                            </p>
                                        </div>
                                    </div>
                                ))
                                )}
                            </div>
                        </div>
                    ):(<p>No se encontraron solicitudes</p>)}
                </div>
                </div>
            </div>
        </div>

        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Solicitud</Modal.Title>
            </Modal.Header>
            <Suspense fallback={<Spinner animation="border" className="m-auto" />}>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="codigo">
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                type="text"
                                name="codigo"
                                value={form.codigo}
                                onChange={handleInputChange}
                                placeholder="Ingresa el código"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="resumen">
                            <Form.Label>Resumen</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="resumen"
                                value={form.resumen}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Describe brevemente tu solicitud"
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </Button>
                        {empleado?.id ? 
                            <Button type="submit" variant="success">
                                Enviar Solicitud
                            </Button>
                        : null}
                    </Modal.Footer>
                </Form>
            </Suspense>
        </Modal>

        <Modal show={isUpdateModalOpen} onHide={() => setIsUpdateModalOpen(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Salario y Fecha de Ingreso</Modal.Title>
            </Modal.Header>
            <Suspense fallback={<Spinner animation="border" className="m-auto" />}>
                <Form onSubmit={handleUpdateSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="salario">
                            <Form.Label>Salario</Form.Label>
                            <Form.Control
                                type="number"
                                name="salario"
                                onChange={handleChange}
                                placeholder="Ingresa el nuevo salario"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="fecha_ingreso">
                            <Form.Label>Fecha de Ingreso</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_ingreso"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="success">
                            Actualizar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Suspense>
        </Modal>
    </div>
  );
};

export default Perfil;
