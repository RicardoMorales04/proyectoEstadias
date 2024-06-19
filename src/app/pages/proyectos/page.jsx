"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Proyectos() {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProject, setUserProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proyectos');
        const result = await response.json();
        // Verificar si result es un array antes de actualizar el estado
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("La respuesta de la API no es un array:", result);
        }

        const userCookie = Cookies.get('user');
        if (userCookie) {
          setIsLoggedIn(true);
          const uid = JSON.parse(userCookie).uid;
          const userResponse = await fetch('/api/proyectos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
          });
          const userResult = await userResponse.json();
          if (userResult.proyecto) {
            setUserProject(userResult.proyecto.proyecto_nombre);
          }
        }
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

        const response = await fetch('/api/proyectos/inscribirse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ proyecto_id: proyectoSeleccionado.proyecto_id, uid }),
        });

        if (response.ok) {
          console.log('Inscripción exitosa:', proyectoSeleccionado.proyecto_id);
          alert('Te has inscrito exitosamente en el proyecto.');
          setUserProject(proyectoSeleccionado.proyecto_nombre);
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
            {/* Verificar si data es un array y tiene elementos */}
            {Array.isArray(data) && data.length > 0 ? (
              data.map((proyecto) => (
                <tr key={proyecto.proyecto_id}>
                  <td>{proyecto.profesor_nombre} {proyecto.profesor_apellidos}</td>
                  <td>{proyecto.proyecto_nombre}</td>
                  <td>{proyecto.descripcion}</td>
                  <td>{proyecto.horario}</td>
                  <td><a href={`/pages/registrados/${proyecto.proyecto_id}`}>Integrantes</a></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay proyectos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isLoggedIn ? (
        userProject ? (
          <p className="divForm">Ya estás inscrito en el proyecto: {userProject}</p>
        ) : (
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
        )
      ) : (
        <p className="divForm">Inicia sesión para unirte a un proyecto.</p>
      )}
    </>
  );
}
