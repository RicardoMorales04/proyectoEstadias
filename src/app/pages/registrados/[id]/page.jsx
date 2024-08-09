'use client';
import '../../../../../public/css/registrados.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

const eliminarUsuario = async (proyectoId, usuarioId) => {
  try {
    const response = await fetch(`/api/registrados/${proyectoId}/${usuarioId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar el usuario: ${await response.text()}`);
    }

    const result = await response.json();
    console.log(result.message);
    return true;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return false;
  }
};

const Registrados = () => {
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [esCreador, setEsCreador] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const uid = JSON.parse(userCookie).uid;

          // Verificar si el usuario es el profesor creador del proyecto
          const userResponse = await fetch('/api/registrados/verificar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, proyecto_id: id }),
          });

          const userData = await userResponse.json();
          console.log('Respuesta de verificar creador:', userData); // Verifica la respuesta
          setEsCreador(userData.esCreador);
        } else {
          console.error('No se encontró la cookie del usuario.');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setError(error.message);
      }
    };

    const fetchUsuarios = async () => {
      try {
        if (!id) {
          console.error('ID no definido');
          return;
        }

        const response = await fetch(`/api/registrados/${id}`); // Ajusta la ruta si es necesario
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la API: ${response.statusText}`);
        }
        const result = await response.json();
        setUsuarios(result);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setError(error.message);
      }
    };

    fetchUserRole();
    fetchUsuarios();
  }, [id]);

  const handleEliminar = async (usuarioId) => {
    const exito = await eliminarUsuario(id, usuarioId);
    if (exito) {
      setUsuarios(usuarios.filter(usuario => usuario.usuario_id !== usuarioId));
    }
  };

  return (
    <div className="container">
      <h1>Usuarios Registrados en el Proyecto</h1>
      {error && <p>Error: {error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Número de Expediente</th>
            <th>Carrera</th>
            {esCreador && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.usuario_id}>
                <td>{usuario.nombre} {usuario.apellidos}</td>
                <td>{usuario.numexpediente}</td>
                <td>{usuario.carrera}</td>
                {esCreador && (
                  <td>
                    <button onClick={() => handleEliminar(usuario.usuario_id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={esCreador ? "4" : "3"}>
                No hay usuarios registrados en este proyecto.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Registrados;
