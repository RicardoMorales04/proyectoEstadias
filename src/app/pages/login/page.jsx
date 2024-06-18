"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../../../public/css/login.css";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Trying to sign in with:', email, password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Cookies.set('user', JSON.stringify({ uid: user.uid, email: user.email }), { expires: 1 });

      console.log('Sign in successful');
      toast.success('Inicio de sesión exitoso');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      console.error('Error signing in: ', err);
      setError('Error de autenticación. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">Iniciar Sesión</button>
        <a href="http://localhost:3000/pages/registro">¿No tienes cuenta? Regístrate Aquí</a>
      </form>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
