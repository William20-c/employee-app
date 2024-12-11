import React from "react";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const Registro = () => {
    const { registro } = useAuth();

    const handleRegistro = async(credenciales) => {
        await registro(credenciales);
    }

    return (
        <div className="auth-container">
            <AuthForm login={false} onSubmit={handleRegistro} />
            <p>
                ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
            </p>
        </div>
    );
}

export default Registro;