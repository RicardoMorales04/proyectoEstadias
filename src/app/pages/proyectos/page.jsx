"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Proyectos() {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const user = Cookies.get('user');
    if (user) {
      setIsLoggedIn(true);
    }
    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedProject) {
      try {
        const proyectoSeleccionado = data.find(proyecto => proyecto.proyecto_id === parseInt(selectedProject));
        if (!proyectoSeleccionado) {
          alert('El proyecto seleccionado no es válido.');
          return;
        }

        const userCookie = Cookies.get('user');
        const uid = JSON.parse(userCookie).uid;
        console.log('Seleccionado:', proyectoSeleccionado.proyecto_id, 'Usuario:', uid);

        const response = await fetch('/api/inscribirse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ proyecto_id: proyectoSeleccionado.proyecto_id, uid }),
        });

        if (response.ok) {
          console.log('Inscripción exitosa:', proyectoSeleccionado.proyecto_id);
          alert('Te has inscrito exitosamente en el proyecto.');
        } else {
          console.error('Error al inscribirse en el proyecto.');
          alert('Hubo un problema al inscribirse en el proyecto. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error en la solicitud de inscripción:', error);
        alert('Hubo un problema al inscribirse en el proyecto. Por favor, inténtalo de nuevo.');
      }
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
      {isLoggedIn ? (
        <div className="divForm">
          <form onSubmit={handleSubmit}>
            <label htmlFor="seleccion">¿Quieres unirte a un proyecto? Selecciona el que más te llamó la atención</label><br></br>
            <select id="seleccion" name="seleccion" value={selectedProject} onChange={handleSelectChange} required>
              <option value="" disabled>Selecciona un proyecto</option>
              {data.map((proyecto) => (
                <option key={proyecto.proyecto_id} value={proyecto.proyecto_id}>{proyecto.proyecto_nombre}</option>
              ))}
            </select>
            <button type="submit" className="botonRegistro">Unirme</button>
          </form>
        </div>
      ) : (
        <p>Inicia sesión para unirte a un proyecto.</p>
      )}
    </>
  );
}
