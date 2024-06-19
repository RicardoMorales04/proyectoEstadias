"use client";
import React, { useState, useEffect } from "react";
import "../../../../public/css/blog.css";
import Cookies from 'js-cookie';

function Blog() {
  const [articulos, setArticulos] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setArticulos(data);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      }
    };

    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setIsLoggedIn(true);
      setUid(user.uid);
    }

    fetchArticulos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          contenido,
          uid
        }),
      });

      if (res.ok) {
        const nuevoArticulo = await res.json();
        setArticulos([nuevoArticulo, ...articulos]);
        setTitulo("");
        setContenido("");
      } else {
        console.error("Error al publicar el artículo:", res.statusText);
      }
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
        {isLoggedIn ? (
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
        ) : (
          <p>Inicia sesión para publicar un artículo.</p>
        )}
        <br />
        <section>
          <h2>Artículos del Blog</h2>
          {articulos.length === 0 ? (
            <p>No hay artículos publicados.</p>
          ) : (
            articulos.map((articulo) => (
              <article key={articulo.blog_id} className="articulo">
                <header>
                  <h2>{articulo.titulo}</h2>
                  <p>{articulo.foto && (
                    <img src={articulo.foto} className="foto-perfil" />
                  )} Por: {articulo.nombre} {articulo.apellidos}</p>
                </header>
                <p>{articulo.contenido}</p>
                <p>Publicado el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Blog;
