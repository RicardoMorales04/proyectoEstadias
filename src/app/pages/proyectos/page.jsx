"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';

export default function Proyectos() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proyectos');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="tit">PROYECTOS</h1>
      <table>
        <thead>
          <tr>
            <th>Profesor Asignado</th>
            <th>Nombre del Proyecto</th>
            <th>Descripción</th>
            <th>Horario</th>
            <th>Alumnos Registrados</th>
            <th>Registrarse</th>
          </tr>
        </thead>
        <tbody>
          {data.map((proyecto) => (
            <tr key={proyecto.proyecto_id}>
              <td>{proyecto.profesor_nombre} {proyecto.profesor_apellidos}</td>
              <td>{proyecto.proyecto_nombre}</td>
              <td>{proyecto.descripcion}</td>
              <td>{proyecto.horario}</td>
              <td><a href={`/pages/registrados/${proyecto.proyecto_id}`}>Integrantes</a></td>
              <td><a href="/pages/registro/registrados">Registrarme</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
