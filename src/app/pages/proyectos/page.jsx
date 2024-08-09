"use client";
import "../../../../public/css/proyectos.css";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Proyectos() {
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProject, setUserProject] = useState(null);
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proyectos');
        const result = await response.json();
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("La respuesta de la API no es un array:", result);
          setData([]);
        }

        const userCookie = Cookies.get('user');
        if (userCookie) {
          setIsLoggedIn(true);
          const uid = JSON.parse(userCookie).uid;

          // Verificar si el usuario es profesor
          const profeResponse = await fetch('/api/verificacion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid }),
          });
          const profeResult = await profeResponse.json();
          setIsProfessor(profeResult.esProfesor);

          if (profeResult.esProfesor) {
            // Verificar si el profesor ya tiene un proyecto
            const proyectoProfesorResponse = await fetch('/api/proyectos/profesor', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ uid }),
            });
            const proyectoProfesorResult = await proyectoProfesorResponse.json();
            if (proyectoProfesorResult.tieneProyecto) {
              setUserProject(proyectoProfesorResult.proyecto.nombre);
            } else {
              setUserProject(null);
            }
          }

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

  const handleCreateProject = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nombre = formData.get('nombre');
    const descripcion = formData.get('descripcion');
    const horario = formData.get('horario');

    if (userProject) {
      alert('Ya tienes un proyecto asignado y no puedes crear más.');
      return;
    }

    if (nombre && descripcion && horario) {
      try {
        const userCookie = Cookies.get('user');
        const uid = JSON.parse(userCookie).uid;

        const response = await fetch('/api/proyectos/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, descripcion, horario, uid }),
        });

        if (response.ok) {
          alert('Proyecto creado exitosamente.');
          fetchData(); // Si tienes un método para refrescar los datos después de la creación
        } else {
          const error = await response.json();
          alert(`Hubo un problema al crear el proyecto: ${error.error}`);
        }
      } catch (error) {
        console.error('Error en la solicitud de creación:', error);
        alert('Hubo un problema al crear el proyecto. Por favor, inténtalo de nuevo.');
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const handleDeleteProject = async (proyecto_id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        const userCookie = Cookies.get('user');
        const uid = JSON.parse(userCookie).uid;
  
        // Verificar si el profesor es el creador del proyecto
        const response = await fetch('/api/proyectos/profesor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ proyecto_id, uid }),
        });
  
        const result = await response.json();
  
        if (!result.esCreador) {
          alert('No tienes permiso para eliminar este proyecto.');
          return;
        }
  
        // Proceder con la eliminación si es el creador
        const deleteResponse = await fetch('/api/proyectos/eliminar', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ proyecto_id }),
        });
  
        if (deleteResponse.ok) {
          // Actualizar los usuarios afectados
          const updateUsersResponse = await fetch('/api/proyectos/actualizarUsuarios', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ proyecto_id }),
          });
  
          if (updateUsersResponse.ok) {
            alert('Proyecto eliminado exitosamente y los usuarios fueron actualizados.');
            setData(data.filter(proyecto => proyecto.proyecto_id !== proyecto_id)); // Actualiza la tabla después de eliminar
          } else {
            alert('Hubo un problema al actualizar los usuarios. Por favor, inténtalo de nuevo.');
          }
        } else {
          alert('Hubo un problema al eliminar el proyecto. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        alert('Hubo un problema al eliminar el proyecto. Por favor, inténtalo de nuevo.');
      }
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
              {isProfessor && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((proyecto) => (
                <tr key={proyecto.proyecto_id}>
                  <td>{proyecto.profesor_nombre} {proyecto.profesor_apellidos}</td>
                  <td>{proyecto.proyecto_nombre}</td>
                  <td>{proyecto.descripcion}</td>
                  <td>{proyecto.horario}</td>
                  <td><a href={`/pages/registrados/${proyecto.proyecto_id}`}>Integrantes</a></td>
                  {isProfessor && (
                    <td><button onClick={() => handleDeleteProject(proyecto.proyecto_id)}>Eliminar</button></td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay proyectos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isLoggedIn ? (
        userProject ? (
          isProfessor ? (
            <p className="divForm">Ya tienes un proyecto impartido: {userProject}</p>
          ) : (
            <p className="divForm">Ya estás inscrito en el proyecto: {userProject}</p>
          )
        ) : isProfessor ? (
          <div className="divForm">
            <h2>Crear un nuevo proyecto</h2>
            <form onSubmit={handleCreateProject}>
              <label htmlFor="nombre">Nombre del Proyecto:</label><br />
              <input type="text" id="nombre" name="nombre" required /><br />
              <label htmlFor="descripcion">Descripción:</label><br />
              <input type="text" id="descripcion" name="descripcion" required /><br />
              <label htmlFor="horario">Horario:</label><br />
              <input type="text" id="horario" name="horario" required /><br />
              <button type="submit" className="botonRegistro">Crear Proyecto</button>
            </form>
          </div>
        ) : (
          <div className="divForm">
            <form onSubmit={handleSubmit}>
              <label htmlFor="seleccion">¿Quieres unirte a un proyecto? Selecciona el que más te llamó la atención</label><br />
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