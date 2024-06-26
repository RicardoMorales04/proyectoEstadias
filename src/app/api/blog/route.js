import { query } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const articles = await query(`
      SELECT blog.blog_id, blog.titulo, blog.contenido, blog.fecha_publicacion, 
             usuarios.nombre, usuarios.apellidos, usuarios.foto
      FROM blog
      JOIN usuarios ON blog.usuario_id = usuarios.usuario_id
      ORDER BY blog.fecha_publicacion DESC
    `);
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los artículos' }, { status: 500 });
  }
}

export async function POST(req) {
  const { titulo, contenido, uid } = await req.json();

  try {
    const usuario = await query(`
      SELECT usuario_id FROM usuarios WHERE uid = ?
    `, [uid]);

    if (usuario.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuario_id = usuario[0].usuario_id;

    const result = await query(`
      INSERT INTO blog (titulo, contenido, usuario_id)
      VALUES (?, ?, ?)
    `, [titulo, contenido, usuario_id]);

    const newArticle = await query(`
      SELECT blog.blog_id, blog.titulo, blog.contenido, blog.fecha_publicacion, 
             usuarios.nombre, usuarios.apellidos, usuarios.foto
      FROM blog
      JOIN usuarios ON blog.usuario_id = usuarios.usuario_id
      WHERE blog.blog_id = ?
    `, [result.insertId]);

    return NextResponse.json(newArticle[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Error al publicar el artículo' }, { status: 500 });
  }
}
