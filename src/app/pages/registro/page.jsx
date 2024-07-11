"use client";
import "../../../../public/css/formulario.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';

function Registro() {
    const [file, setFile] = useState(null);
    const [usuario, setUsuario] = useState({
        correo: '',
        password: '',
        nombre: '',
        apellidos: '',
        numExpediente: '',
        carrera: '',
        cuatrimestre: ''
    });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({
            ...usuario,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const camposCompletos = Object.values(usuario).every(campo => campo !== '') && file !== null;

        if (!camposCompletos) {
            setError('Todos los campos deben estar completos.');
            return;
        }

        if (usuario.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            const expedienteRes = await axios.post("/api/usuarios/verificarExpediente", { numExpediente: usuario.numExpediente });
            if (expedienteRes.data.exists) {
                setError('El número de expediente ya está registrado.');
                return;
            }

            const methods = await fetchSignInMethodsForEmail(auth, usuario.correo);
            if (methods.length > 0) {
                setError('El correo electrónico ya está en uso.');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, usuario.correo, usuario.password);
            const user = userCredential.user;

            const formData = new FormData();
            formData.append('uid', user.uid);
            formData.append('nombre', usuario.nombre);
            formData.append('apellidos', usuario.apellidos);
            formData.append('numExpediente', usuario.numExpediente);
            formData.append('carrera', usuario.carrera);
            formData.append('cuatrimestre', usuario.cuatrimestre);
            formData.append('foto', file);

            const res = await axios.post("/api/usuarios", formData, {
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
            console.error('Error al registrar el usuario: ', err);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="tit">REGISTRO</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="correo">Correo Electrónico:</label>
                    <input className="inputs" type="email" id="correo" name="correo" value={usuario.correo} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input className="inputs" type="password" id="password" name="password" value={usuario.password} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input className="inputs" type="text" id="nombre" name="nombre" value={usuario.nombre} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="apellidos">Apellidos:</label>
                    <input className="inputs" type="text" id="apellidos" name="apellidos" value={usuario.apellidos} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="numExpediente">Número de Expediente:</label>
                    <input className="inputs" type="text" maxLength="10" id="numExpediente" name="numExpediente" value={usuario.numExpediente} onChange={handleChange} onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, '');}} required />
                </div>
                <div>
                    <label htmlFor="carrera">Carrera:</label>
                    <select id="carrera" name="carrera" value={usuario.carrera} onChange={handleChange} required>
                        <option value="">Selecciona tu carrera</option>
                        <option value="Tsu TI">TSU en Tecnologías de la Información, Área Desarrollo de Software Multiplataforma</option>
                        <option value="Tsu Mecatrónica">TSU en Mecatrónica Área Automatización</option>
                        <option value="Tsu Construcción">TSU en Construcción</option>
                        <option value="Tsu Industrial">TSU en Mantenimiento Área Industrial</option>
                        <option value="Ing TI">ING en Desarrollo de Software Multiplataforma</option>
                        <option value="Ing Mecatrónica">ING en Mecatrónica</option>
                        <option value="Ing Construcción">ING Civil</option>
                        <option value="Ing Industrial">ING en Mantenimiento Industrial</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="cuatrimestre">Cuatrimestre:</label>
                    <select id="cuatrimestre" name="cuatrimestre" value={usuario.cuatrimestre} onChange={handleChange} required>
                        <option value="">Selecciona tu cuatrimestre</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
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

export default Registro;