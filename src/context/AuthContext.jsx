import React, { createContext, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  

  const login = async(credenciales) => {
    try {
        const resp = await fetch('http://localhost:3000/api/auth/login',{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({
                correo: credenciales.email,
                password: credenciales.password
            }) 
        });

        const data = await resp.json();

        console.log(resp.ok);

        if(resp.ok){
          console.log('Set user')
            setUser(data.usuario);
            localStorage.setItem("user", JSON.stringify(data.usuario));
            setToken(data.token);
            localStorage.setItem('token',data.token)
            if (data.usuario.rol === "admin") {
              navigate("/empleados");
            }else{
              navigate("/perfil");
            }
        }else{
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Error al conectar con el servidor");
    }
  };

  const registro = async (credenciales) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nombre:credenciales.nombre,
            email: credenciales.email,
            password: credenciales.password,
            rol:'empleado'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/");
      } else {
        alert(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);