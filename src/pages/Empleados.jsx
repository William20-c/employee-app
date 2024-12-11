import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap"; 
import "bootstrap/dist/css/bootstrap.min.css"; 

const Empleados = () => {
  const {user, logout} = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [idEmpleado, setIdEmpleado] = useState();
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [showModal, setShowModal] = useState(false); 
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    correo: "",
    fecha_ingreso: "",
    salario: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && user.rol == 'admin') {
      navigate("/");
    }
  }, [navigate]);

  const obtenerEmpleados = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:3000/api/empleados?pagina=${pagina}&totalPagina=10`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setEmpleados(data.empleados);
      setTotalPaginas(data.totalRegistros);
    }else{
      if(response.status === 400){
        localStorage.removeItem("token"); 
        window.location.href = "/";
        return;
      }
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, [pagina]);

  const cambiarPagina = (numero) => {
    if (numero > 0 && numero <= totalPaginas) {
      setPagina(numero);
    }
  };

  const verSolicitudes = async (idEmpleado) => {
    setIdEmpleado(idEmpleado)
    setLoadingSolicitudes(true);
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/api/solicitud/${idEmpleado}`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      setSolicitudes(data);
    } else {
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
    setLoadingSolicitudes(false);
  };

  const formatSalario = (salario) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(salario);
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toISOString().split("T")[0];
  };

  const eliminarEmpleado = (id) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3000/api/empleados/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${token}`, 
            }
          });
      
          if (response.ok) {
            Swal.fire("Eliminado", "El empleado ha sido eliminado.", "success");
            obtenerEmpleados();
          } else {
            const error = await response.json();
            Swal.fire("Error", error.message || "Hubo un error al eliminar el empleado", "error");
          }
        } catch (error) {
          console.error("Error al eliminar empleado:", error);
          Swal.fire("Error", "No se pudo realizar la solicitud", "error");
        }
        
      }
    });
  };

  const columns = [
    {
      name: "ID",
      selector: row => row.id,
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
    },
    {
      name: "Fecha Ingreso",
      selector: row => formatFecha(row.fecha_ingreso),
    },
    {
      name: "Salario",
      selector: row => formatSalario(row.salario),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <button
            className="btn btn-info me-2"
            onClick={() => verSolicitudes(row.id)}
          >
            Ver Solicitudes
          </button>
          <button
            className="btn btn-danger"
            onClick={() => eliminarEmpleado(row.id)}
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({
      ...nuevoEmpleado,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); 
  
    const nuevoEmpleadoData = {
      nombre: nuevoEmpleado.nombre,
      correo: nuevoEmpleado.correo,
      fecha_ingreso: nuevoEmpleado.fecha_ingreso, 
      salario: nuevoEmpleado.salario,
    };
    
    
    try {
      const response = await fetch("http://localhost:3000/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(nuevoEmpleadoData), 
      });
  
      if (response.ok) {
        const data = await response.json();
        Swal.fire("Empleado agregado", "El nuevo empleado ha sido agregado.", "success");
        setShowModal(false); 
        obtenerEmpleados(); 
      } else {
        const errorData = await response.json();
        Swal.fire("Error", errorData.message || "Hubo un error al agregar el empleado", "error");
      }
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      Swal.fire("Error", "No se pudo realizar la solicitud", "error");
    }
  };

  const eliminarSolicitud = async (idSolicitud) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`http://localhost:3000/api/solicitud/${idSolicitud}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        Swal.fire("Eliminado", "La solicitud ha sido eliminada con éxito", "success");
        verSolicitudes(idEmpleado);
      } else {
        Swal.fire("Error", "No se pudo eliminar la solicitud", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un error al eliminar la solicitud", "error");
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
      <h2 className="mb-4 text-center">Lista de Empleados</h2>

      <button
        onClick={() => setShowModal(true)} 
        className="btn btn-success mb-3"
      >
        Agregar Nuevo
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={empleados}
            pagination
            paginationServer
            paginationTotalRows={totalPaginas}
            onChangePage={cambiarPagina}
            highlightOnHover
            striped
            noHeader
            responsive
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          onClick={() => cambiarPagina(pagina - 1)}
          disabled={pagina === 1}
          className="btn btn-primary"
        >
          Anterior
        </button>
        <span className="mx-2">{pagina} de {totalPaginas}</span>
        <button
          onClick={() => cambiarPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
          className="btn btn-primary"
        >
          Siguiente
        </button>
      </div>

      {solicitudes.length > 0 && (
        <div className="mt-4">
          <h3>Solicitudes</h3>
          <div className="card-deck">
            {loadingSolicitudes ? (
              <p>Cargando solicitudes...</p>
            ) : (
              solicitudes.map((solicitud) => (
                <div key={solicitud.id} className="card mb-2">
                  <div className="card-body">
                    <div className="text-end">
                      <Button variant="danger" onClick={() => eliminarSolicitud(solicitud.id)}>Eliminar</Button>
                    </div>
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
      )}


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="nombre"
                value={nuevoEmpleado.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCorreo" className="mt-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo"
                name="correo"
                value={nuevoEmpleado.correo}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFechaIngreso" className="mt-3">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control
                type="date"
                name="fecha_ingreso"
                value={nuevoEmpleado.fecha_ingreso}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSalario" className="mt-3">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el salario"
                name="salario"
                value={nuevoEmpleado.salario}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="mt-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Empleados;
