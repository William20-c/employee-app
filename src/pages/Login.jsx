import React, {useEffect} from "react";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(user !== null)
            user?.rol == "admin" ? navigate("/empleados") : navigate("/perfil")
    },[navigate])

    const handleLogin = async(credenciales) => {
        console.log(credenciales);
        await login(credenciales);
    }

    return (
        <div className="auth-container">
            <AuthForm login={true} onSubmit={handleLogin} />
            <p>
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
        </div>

    );
}

export default Login;