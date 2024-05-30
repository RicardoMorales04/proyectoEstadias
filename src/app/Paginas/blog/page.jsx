"use client";
import React, { useState, useEffect } from "react";
import "../../../../public/css/blog.css";

function Blog() {
    const [articulos, setArticulos] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [autor, setAutor] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const fetchArticulos = async () => {
            const res = await fetch("/api/blogs");
            const data = await res.json();
            setArticulos(data);
        };

        fetchArticulos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                titulo,
                contenido,
                autor,
            }),
        });

        if (res.ok) {
            setMensaje("Artículo publicado con éxito");
            setTitulo("");
            setContenido("");
            setAutor("");
            const data = await res.json();
            setArticulos([data, ...articulos]);
        } else {
            setMensaje("Error al publicar el artículo");
        }
    };

    return (
        <div className="blog">
            <header>
                <h1>Taller de Proyectos de Inteligencia Artificial - Universidad Tecnológica de San Juan del Río</h1>
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
                        <div>
                            <label>Autor:</label>
                            <input
                                type="text"
                                value={autor}
                                onChange={(e) => setAutor(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Publicar</button>
                    </form>
                    {mensaje && <p className={mensaje.startsWith("Error") ? "error" : "mensaje"}>{mensaje}</p>}
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
