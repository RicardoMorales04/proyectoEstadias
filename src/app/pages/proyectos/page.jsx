"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';

export default function Proyectos() {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

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

  const handleSelectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedProject) {
      // Aquí puedes agregar la lógica para unirte al proyecto seleccionado
      console.log('Proyecto seleccionado:', selectedProject);
    } else {
      alert('Por favor, selecciona un proyecto.');
    }
  };

  return (
    <>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divForm">
        <form onSubmit={handleSubmit}>
          <label htmlFor="seleccion">¿Quieres unirte a un proyecto? Selecciona el que más te llamó la atención</label><br></br>
          <select id="seleccion" name="seleccion" value={selectedProject} onChange={handleSelectChange} required>
            <option value="" disabled>Selecciona un proyecto</option>
            {data.map((proyecto) => (
              <option key={proyecto.proyecto_id} value={proyecto.proyecto_nombre}>{proyecto.proyecto_nombre}</option>
            ))}
          </select>
          <button type="submit" className="botonRegistro">Unirme</button>
        </form>
      </div>
    </>
  );
}

