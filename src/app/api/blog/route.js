import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows: articles } = await sql`
            SELECT blog.blog_id, blog.titulo, blog.contenido, blog.fecha_publicacion, 
                   COALESCE(usuarios.nombre, profesores.nombre_p) AS nombre,
                   COALESCE(usuarios.apellidos, profesores.apellidos_p) AS apellidos,
                   COALESCE(usuarios.foto, profesores.foto_p) AS foto,
                   COALESCE(usuarios.uid, profesores.uid_p) AS uid
            FROM blog
            LEFT JOIN usuarios ON blog.usuario_id = usuarios.usuario_id
            LEFT JOIN profesores ON blog.profe_id = profesores.profe_id
            ORDER BY fecha_publicacion DESC;
        `;
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener los artículos' }, { status: 500 });
    }
}

export async function POST(req) {
    const { titulo, contenido, uid } = await req.json();

    try {
        // Buscar en la tabla de usuarios
        const { rows: usuario } = await sql`
            SELECT usuario_id, nombre, apellidos, foto FROM usuarios WHERE uid = ${uid};
        `;

        let userInfo = {};

        if (usuario.length === 0) {
            // Si no se encuentra en usuarios, buscar en profesores
            const { rows: profesor } = await sql`
                SELECT profe_id AS usuario_id, nombre_p AS nombre, apellidos_p AS apellidos, foto_p AS foto 
                FROM profesores WHERE uid_p = ${uid};
            `;

            if (profesor.length === 0) {
                return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }

            userInfo = profesor[0];

            const { rows: result } = await sql`
                INSERT INTO blog (titulo, contenido, profe_id)
                VALUES (${titulo}, ${contenido}, ${userInfo.usuario_id})
                RETURNING blog_id, titulo, contenido, fecha_publicacion;
            `;

            const newArticle = result[0];

            return NextResponse.json({
                ...newArticle,
                nombre: userInfo.nombre,
                apellidos: userInfo.apellidos,
                foto: userInfo.foto,
                uid: uid // Asegúrate de devolver el UID también
            });
        } else {
            userInfo = usuario[0];

            const { rows: result } = await sql`
                INSERT INTO blog (titulo, contenido, usuario_id)
                VALUES (${titulo}, ${contenido}, ${userInfo.usuario_id})
                RETURNING blog_id, titulo, contenido, fecha_publicacion;
            `;

            const newArticle = result[0];

            return NextResponse.json({
                ...newArticle,
                nombre: userInfo.nombre,
                apellidos: userInfo.apellidos,
                foto: userInfo.foto,
                uid: uid // Asegúrate de devolver el UID también
            });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error al publicar el artículo' }, { status: 500 });
    }
}


