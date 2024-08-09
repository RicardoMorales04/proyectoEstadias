"use client";
import "../../../../public/css/seleccion.css";
import React from 'react';
import { useRouter } from 'next/navigation';

function SeleccionPage() {
  const router = useRouter();

  const handleProfesorClick = () => {
    router.push('/pages/registro_profe');
  };

  const handleUsuarioClick = () => {
    router.push('/pages/registro');
  };

  return (
    <div className="seleccion-container">
      <h2 className="seleccion-title">Selecciona tu tipo de registro</h2>
      <div className="button-group">
        <button className="seleccion-button profesor-button" onClick={handleProfesorClick}>Registrarse como Profesor</button>
        <button className="seleccion-button usuario-button" onClick={handleUsuarioClick}>Registrarse como Usuario</button>
      </div>
    </div>
  );
}

export default SeleccionPage;
