"use client";
import React, { useState, useEffect } from "react";
import "../../../../public/css/blog.css";

function Blog() {
    const [articulos, setArticulos] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                // Realizar la solicitud GET a la API para obtener los artículos
                const res = await fetch("/api/blogs");
                const data = await res.json();
                setArticulos(data); // Establecer los artículos obtenidos en el estado local
            } catch (error) {
                console.error("Error al obtener los artículos:", error);
                // Manejar errores de solicitud o procesamiento de datos
            }
        };

        fetchArticulos(); // Llamar a la función de obtención de artículos al montar el componente
    }, []); // El array vacío como dependencia asegura que se ejecute solo una vez al montarse el componente

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Código para enviar un nuevo artículo a la API si es necesario
            // Aquí puedes implementar la lógica para enviar datos al backend
            // Por ejemplo, utilizando fetch o axios para realizar una solicitud POST
        } catch (error) {
            console.error("Error al publicar el artículo:", error);
            // Manejar errores de publicación de artículo
        }
    };

    return (
        <div className="blog">
            <header>
                <h1>Blog de los Talleres de Proyectos de Inteligencia Artificial - Universidad Tecnológica de San Juan del Río</h1>
            </header>
            <main>
                <section>
                    <h2>Publicar un nuevo artículo</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Título:</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Contenido:</label>
                            <textarea
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit">Publicar</button>
                    </form>
                </section>
                <section>
                    <h2>Artículos del Blog</h2>
                    {articulos.length === 0 ? (
                        <p>No hay artículos publicados.</p>
                    ) : (
                        articulos.map((articulo) => (
                            <article key={articulo.blog_id}>
                                <header>
                                    <h2>{articulo.titulo}</h2>
                                    <p>Por: {articulo.autor} | Publicado el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
                                </header>
                                <p>{articulo.contenido}</p>
                            </article>
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}

export default Blog;
