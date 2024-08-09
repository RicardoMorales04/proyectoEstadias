import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    const { id } = params;
    const { titulo, contenido, uid } = await req.json();

    try {
        // Verifica si el UID coincide con el del autor del artículo
        const { rows: article } = await sql`
            SELECT usuario_id, profe_id FROM blog WHERE blog_id = ${id};
        `;

        if (article.length === 0) {
            return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
        }

        const { usuario_id, profe_id } = article[0];

        // Verifica si el UID coincide con el del autor del artículo
        let isAuthorized = false;
        if (usuario_id) {
            const { rows: usuario } = await sql`
                SELECT uid FROM usuarios WHERE usuario_id = ${usuario_id};
            `;
            if (usuario.length > 0 && usuario[0].uid === uid) {
                isAuthorized = true;
            }
        } else if (profe_id) {
            const { rows: profesor } = await sql`
                SELECT uid_p AS uid FROM profesores WHERE profe_id = ${profe_id};
            `;
            if (profesor.length > 0 && profesor[0].uid === uid) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'No autorizado para modificar este artículo' }, { status: 403 });
        }

        const { rows: updatedArticle } = await sql`
            UPDATE blog
            SET titulo = ${titulo}, contenido = ${contenido}
            WHERE blog_id = ${id}
            RETURNING blog_id, titulo, contenido, fecha_publicacion;
        `;

        if (updatedArticle.length === 0) {
            return NextResponse.json({ error: 'Error al actualizar el artículo' }, { status: 404 });
        }

        return NextResponse.json(updatedArticle[0]);
    } catch (error) {
        console.error("Error al modificar el artículo:", error); // Detalle del error en los logs
        return NextResponse.json({ error: 'Error al modificar el artículo' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    const { uid } = await req.json(); // UID del usuario autenticado

    try {
        // Verifica si el UID coincide con el del autor del artículo
        const { rows: article } = await sql`
            SELECT usuario_id, profe_id FROM blog WHERE blog_id = ${id};
        `;

        if (article.length === 0) {
            return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
        }

        const { usuario_id, profe_id } = article[0];

        // Verifica si el UID coincide con el del autor del artículo
        let isAuthorized = false;
        if (usuario_id) {
            const { rows: usuario } = await sql`
                SELECT uid FROM usuarios WHERE usuario_id = ${usuario_id};
            `;
            if (usuario.length > 0 && usuario[0].uid === uid) {
                isAuthorized = true;
            }
        } else if (profe_id) {
            const { rows: profesor } = await sql`
                SELECT uid_p AS uid FROM profesores WHERE profe_id = ${profe_id};
            `;
            if (profesor.length > 0 && profesor[0].uid === uid) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return NextResponse.json({ error: 'No autorizado para eliminar este artículo' }, { status: 403 });
        }

        await sql`
            DELETE FROM blog WHERE blog_id = ${id};
        `;

        return NextResponse.json({ message: 'Artículo eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar el artículo:", error); // Detalle del error en los logs
        return NextResponse.json({ error: 'Error al eliminar el artículo' }, { status: 500 });
    }
}
