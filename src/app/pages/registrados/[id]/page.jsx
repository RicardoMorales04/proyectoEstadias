'use client';
import '../../../../../public/css/registrados.css';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Registrados = () => {
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        console.log(id);
        const response = await fetch(`/api/registrados/${id}`);
        const result = await response.json();

        if (Array.isArray(result)) {
          setUsuarios(result);
        } else {
          console.error("La respuesta de la API no es un array:", result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="container">
      <h1>Usuarios Registrados en el Proyecto</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Número de Expediente</th>
            <th>Carrera</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuarios) && usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.usuario_id}>
                <td>{usuario.nombre} {usuario.apellidos}</td>
                <td>{usuario.numExpediente}</td>
                <td>{usuario.carrera}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay usuarios registrados en este proyecto.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Registrados;