"use client";
import "../../../../public/css/formulario.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';

function RegistroProfesor() {
    const [file, setFile] = useState(null);
    const [profesor, setProfesor] = useState({
        correo: '',
        password: '',
        nombre_p: '',
        apellidos_p: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfesor({
            ...profesor,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const camposCompletos = Object.values(profesor).every(campo => campo !== '') && file !== null;

        if (!camposCompletos) {
            setError('Todos los campos deben estar completos.');
            return;
        }

        if (profesor.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            const methods = await fetchSignInMethodsForEmail(auth, profesor.correo);
            if (methods.length > 0) {
                setError('El correo electrónico ya está en uso.');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, profesor.correo, profesor.password);
            const user = userCredential.user;

            const formData = new FormData();
            formData.append('uid_p', user.uid);
            formData.append('nombre_p', profesor.nombre_p);
            formData.append('apellidos_p', profesor.apellidos_p);
            formData.append('foto', file);

            const res = await axios.post("/api/profesores", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.message) {
                setError(res.data.message);
                return;
            }

            console.log("Respuesta del servidor:", res.data);
            router.push("/pages/login");
        } catch (err) {
            console.error('Error al registrar el profesor: ', err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="tit">REGISTRO DE PROFESORES</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="correo">Correo Electrónico:</label>
                    <input className="inputs" type="email" id="correo" name="correo" value={profesor.correo} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input className="inputs" type="password" id="password" name="password" value={profesor.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="nombre_p">Nombre:</label>
                    <input className="inputs" type="text" id="nombre_p" name="nombre_p" value={profesor.nombre_p} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="apellidos_p">Apellidos:</label>
                    <input className="inputs" type="text" id="apellidos_p" name="apellidos_p" value={profesor.apellidos_p} onChange={handleChange} required />
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} required />
                    <div className="imagenCarga">
                        {file && <img src={URL.createObjectURL(file)} alt="Imagen Cargada" />}
                    </div>
                </div>
                <div>
                    <input className="inputs" type="checkbox" id="terminos" name="terminos" required />
                    <label htmlFor="terminos">Acepto los términos y condiciones</label>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="botonRegistro">Registrar</button>
            </form>
        </div>
    );
}

export default RegistroProfesor;
