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
  const [editMode, setEditMode] = useState(false);
  const [editArticulo, setEditArticulo] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editContenido, setEditContenido] = useState("");

  useEffect(() => {
    fetchArticulos();
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      setIsLoggedIn(true);
      setUid(user.uid);
    }
  }, []);

  const fetchArticulos = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (Array.isArray(data)) {
        setArticulos(data);
      } else {
        console.error("La respuesta de la API no es un array:", data);
      }
    } catch (error) {
      console.error("Error al obtener los artículos:", error);
    }
  };

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

  const handleDelete = async (id) => {
    try {
        const res = await fetch(`/api/blog/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid }), // Asegúrate de enviar el UID del usuario autenticado
        });

        if (res.ok) {
            setArticulos(articulos.filter((articulo) => articulo.blog_id !== id));
        } else {
            const errorData = await res.json();
            console.error("Error al eliminar el artículo:", errorData.error);
        }
    } catch (error) {
        console.error("Error al eliminar el artículo:", error);
    }
};


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editArticulo) {
        try {
            const res = await fetch(`/api/blog/${editArticulo.blog_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo: editTitulo,
                    contenido: editContenido,
                    uid,
                }),
            });

            if (res.ok) {
                await fetchArticulos(); // Refresca los artículos
                setEditMode(false);
                setEditArticulo(null);
                setEditTitulo("");
                setEditContenido("");
            } else {
                const errorData = await res.json();
                console.error("Error al modificar el artículo:", errorData.error);
            }
        } catch (error) {
            console.error("Error al modificar el artículo:", error);
        }
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
          {Array.isArray(articulos) && articulos.length > 0 ? (
            articulos.map((articulo) => (
              <article key={articulo.blog_id} className="articulo">
                <header>
                  <h2>{articulo.titulo}</h2>
                  <p>
                    {articulo.foto && (
                      <img src={articulo.foto} className="foto-perfil" alt="Foto de perfil" />
                    )}
                    Por: {articulo.nombre} {articulo.apellidos}
                  </p>
                </header>
                <p>{articulo.contenido}</p>
                <p>Publicado el {new Date(articulo.fecha_publicacion).toLocaleDateString()}</p>
                {isLoggedIn && uid === articulo.uid && (
                  <div>
                    <button onClick={() => handleEditClick(articulo)}>Modificar</button>
                    <button onClick={() => handleDelete(articulo.blog_id)}>Eliminar</button>
                  </div>
                )}
              </article>
            ))
          ) : (
            <p>No hay artículos publicados.</p>
          )}
        </section>

        {/* Formulario de edición */}
        {editMode && (
          <section>
            <h2>Editar Artículo</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Título:</label>
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Contenido:</label>
                <textarea
                  value={editContenido}
                  onChange={(e) => setEditContenido(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default Blog;
