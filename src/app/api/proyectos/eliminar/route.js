import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
    try {
        const { proyecto_id } = await req.json();

        if (!proyecto_id) {
            throw new Error('El ID del proyecto es obligatorio.');
        }

        // Primero, actualiza los usuarios para restablecer el campo proyecto_id a null
        const updateResult = await sql`
            UPDATE usuarios
            SET proyecto_id = NULL
            WHERE proyecto_id = ${proyecto_id};
        `;

        // Ahora, elimina el proyecto de la tabla proyectos
        const { rowCount } = await sql`
            DELETE FROM proyectos
            WHERE proyecto_id = ${proyecto_id}
            RETURNING proyecto_id;
        `;

        if (rowCount === 0) {
            return NextResponse.json({ error: 'Proyecto no encontrado.' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Proyecto y usuarios actualizados exitosamente.',
        });

    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
