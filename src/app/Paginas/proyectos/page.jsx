"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';

export default function ProyectosTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/proyectos');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1 className="tit">Proyectos</h1>
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
          {data.map((proyectos) => (
            <tr key={proyectos.proyecto_id}>
              <td>{proyectos.profesor_nombre} {proyectos.profesor_apellidos}</td>
              <td>{proyectos.proyecto_nombre}</td>
              <td>{proyectos.descripcion}</td>
              <td>{proyectos.horario}</td>
              <td><a href="/Paginas/registro/registrados">Integrantes</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}