"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('/api/usuarios');
                console.log('Datos de usuarios:', response.data);
                setUsuarios(response.data);
            } catch (error) {
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <h1>Usuarios Registrados</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Número de Expediente</th>
                        <th>Carrera</th>
                        <th>Cuatrimestre</th>
                        <th>Foto</th>
                        <th>Fecha de Inscripción</th>
                    </tr>
                </thead>
                {Array.isArray(usuarios) ? (
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.usuario_id}>
                                <td>{usuario.usuario_id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellidos}</td>
                                <td>{usuario.numExpediente}</td>
                                <td>{usuario.carrera}</td>
                                <td>{usuario.cuatrimestre}</td>
                                <td>
                                    {usuario.foto && (
                                        <img
                                            src={`data:image/jpeg;base64,${Buffer.from(usuario.foto).toString('base64')}`}
                                            alt="Foto"
                                            width="50"
                                            height="50"
                                        />
                                    )}
                                </td>
                                <td>{new Date(usuario.fecha_inscripcion).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td colSpan="2">No se encontraron usuarios.</td>
                        </tr>
                    </tbody>
                )}

            </table>
            <style jsx>{`
        .container {
          padding: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        img {
          display: block;
          margin: 0 auto;
        }
      `}</style>
        </div>
    );
}

export default Usuarios;

