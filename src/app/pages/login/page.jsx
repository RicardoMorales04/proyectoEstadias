"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../../../public/css/login.css";

function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [numExpediente, setNumExpediente] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, numExpediente }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('Error en el servidor. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="numExpediente">Numero de Expediente</label>
          <input type="password" id="numExpediente" value={numExpediente} onChange={(e) => setNumExpediente(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Iniciar Sesion</button>
        <a href="http://localhost:3000/pages/registro">¿No tienes cuenta? Regístrate Aquí</a>
      </form>
    </div>
  );
}

export default LoginPage;
