import { useState } from 'react';
import { User, Lock, Mail } from 'lucide-react'; 
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Correo:', correo);
    console.log('Contraseña ingresada:', Boolean(contrasena));
    console.log('Recuerdame:', recordar);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Formulario */}
        <div className="login-form-pane">
          <div className="brand">
            <div className="brand-logo">
              <div className="square s1"></div>
              <div className="square s2"></div>
            </div>
            <span className="brand-name">FEICV</span>
          </div>

          <div className="avatar-container">
            <div className="avatar-icon">
              <User size={36} strokeWidth={1.5} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <Mail className="field-icon" size={18} />
              <input
                id="correo"
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock className="field-icon" size={18} />
              <input
                id="contrasena"
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              INICIAR SESIÓN
            </button>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                />
                <span className="checkmark"></span>
                Recordarme
              </label>
              <a href="#forgot" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>

        </div>

        {/* Mensaje */}
        <div className="login-art-pane">

          <div className="art-content">
            <h1>Bienvenido.</h1>
            <p>
              Accede a FEICV, evalúa tus conocimientos y crea un currículum
               personalizado con apoyo de inteligencia artificial, 
              destacando tus habilidades y competencias de forma clara, 
              sencilla e intuitiva.
            </p>

            <div className="signup-prompt">
              ¿No tienes cuenta? <a href="#signup">Regístrate ahora</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;