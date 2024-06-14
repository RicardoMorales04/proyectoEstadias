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
                const res = await fetch("/api/blogs");
                const data = await res.json();
                setArticulos(data);
            } catch (error) {
                console.error("Error al obtener los artículos:", error);
            }
        };

        fetchArticulos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        } catch (error) {
            console.error("Error al publicar el artículo:", error);
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
