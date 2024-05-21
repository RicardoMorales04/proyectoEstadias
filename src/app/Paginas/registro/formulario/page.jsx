"use client";
import "../../../../../public/css/formulario.css"
import React, { useState } from 'react';
import axios from 'axios';

function Registro() {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellidos: '',
        numExpediente: '',
        carrera: '',
        cuatrimestre: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({
            ...usuario,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUsuario({
                ...usuario,
                foto: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post('/api/usuarios', usuario);
            console.log(resp);
        } catch (err) {
            console.error('Error al registrar:', err);
        }
    };


    return (
        <div className="container">
            <h1>Registro al Taller</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={usuario.nombre} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="nombre">Apellidos:</label>
                    <input type="text" id="apellidos" name="apellidos" value={usuario.apellidos} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="numExpediente">Número de Expediente:</label>
                    <input type="text" id="numExpediente" name="numExpediente" value={usuario.numExpediente} onChange={handleChange} required />
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
                    <input type="file" id="foto" name="foto" accept="image/*" onChange={handleFileChange}/>
                    <label htmlFor="foto">Cargar Imagen:</label>
                </div>

                <div>
                    <input type="checkbox" id="terminos" name="terminos" required />
                    <label htmlFor="terminos">Acepto los términos y condiciones</label>
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    )
}

export default Registro