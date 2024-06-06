"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../../../../public/css/registrados.css';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/usuarios');
                setUsuarios(data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };
        fetchUsuarios();
    }, []);
    console.log("URL de las fotos:", usuarios.map(usuario => `data:image/jpeg;base64,${Buffer.from(usuario.foto.data).toString('base64')}`));
    return (
        <>
        <div className="contenedor">
            <h1>Alumnos Registrados</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Numero de Expediente</th>
                        <th>Carrera</th>
                        <th>Cuatrimestre</th>
                        <th>Foto</th>
                        <th>Fecha de Inscripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.usuario_id}>
                            <td>{usuario.usuario_id}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellidos}</td>
                            <td>{usuario.numExpediente}</td>
                            <td>{usuario.carrera}</td>
                            <td>{usuario.cuatrimestre}</td>
                            <td className="foto">
                                <img src={`data:image/jpeg;base64,${Buffer.from(usuario.foto.data).toString('base64')}`} alt="Foto de usuario" />
                            </td>
                            <td>{new Date(usuario.fecha_inscripcion).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
        );
}

export default Usuarios;