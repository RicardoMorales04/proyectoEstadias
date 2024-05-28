"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import '../../../../../public/css/registrados.css';

async function loadUsuarios() {
    const { data } = await axios.get('http://localhost:3000/api/usuarios');
    return data;
}

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        async function fetchUsuarios() {
            const data = await loadUsuarios();
            setUsuarios(data);
        }
        fetchUsuarios();
    }, []);

    function getPhotoUrl(foto) {
        if (typeof foto === 'string' && foto.startsWith('data:image/')) {
            // La foto ya está en formato base64
            return foto;
        } else if (foto && foto.data) {
            // La foto está en formato binario, necesita conversión a base64
            return `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(foto.data)))}`;
        }
        // En caso de que la foto no esté disponible o no esté en un formato esperado
        return '';
    }

    return (
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
                    {usuarios.map(usuario => {
                        const photoUrl = getPhotoUrl(usuario.foto);
                        return (
                            <tr key={usuario.usuario_id}>
                                <td>{usuario.usuario_id}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellidos}</td>
                                <td>{usuario.numExpediente}</td>
                                <td>{usuario.carrera}</td>
                                <td>{usuario.cuatrimestre}</td>
                                <td><img src={photoUrl} alt="Foto de usuario" /></td>
                                <td>{new Date(usuario.fecha_inscripcion).toLocaleDateString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Usuarios;

