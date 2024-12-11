import React, {useState} from 'react';

const AuthForm = ({ login ,onSubmit }) => {
    const [nombre, setNombre ] = useState("");
    const [email, setEmail ] = useState("");
    const [password, setPassword ] = useState(""); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { email, password };
        if (!login) {
          formData.nombre = nombre;
        }
        onSubmit(formData);
      };

    return(
        <div className="auth-card">
            <h2>{login ? "Iniciar Sesión" : "Registro"}</h2>
            <form onSubmit={handleSubmit}>
                {!login && (
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required={!login}
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Correo electrónico</label>
                    <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input 
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {login ? "Iniciar Sesión" : "Registrarse"}
                </button>        
            </form>
        </div>
    );
}

export default AuthForm;