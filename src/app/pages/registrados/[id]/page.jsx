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
        console.log(id);
        const response = await fetch(`/api/registrados/${id}`);
        const result = await response.json();
        setUsuarios(result);
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
            <th>Numero de Expediente</th>
            <th>Carrera</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.usuario_id}>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.numExpediente}</td>
              <td>{usuario.carrera}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Registrados;

