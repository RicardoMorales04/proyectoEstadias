import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { uid, proyecto_id } = await req.json();

        if (!uid) {
            throw new Error('UID es obligatorio.');
        }

        // Obtener el profe_id basado en el uid
        const { rows: profesores } = await sql`
            SELECT profe_id FROM profesores WHERE uid_p = ${uid};
        `;

        if (profesores.length === 0) {
            throw new Error('No se encontró un profesor con el UID proporcionado.');
        }

        const profe_id = profesores[0].profe_id;

        // Verificar si el profesor ya tiene un proyecto asignado o es el creador de un proyecto específico
        let query;
        if (proyecto_id) {
            query = sql`
                SELECT proyecto_id, nombre 
                FROM proyectos 
                WHERE profe_id = ${profe_id} AND proyecto_id = ${proyecto_id}
                LIMIT 1;
            `;
        } else {
            query = sql`
                SELECT proyecto_id, nombre 
                FROM proyectos 
                WHERE profe_id = ${profe_id}
                LIMIT 1;
            `;
        }

        const { rows: proyectos } = await query;

        if (proyectos.length > 0) {
            // Si el profesor tiene un proyecto asignado o es el creador del proyecto especificado
            return NextResponse.json({
                tieneProyecto: true,
                proyecto: proyectos[0],
                esCreador: proyecto_id ? true : false,
            });
        } else {
            // Si el profesor no tiene un proyecto asignado o no es el creador del proyecto especificado
            return NextResponse.json({
                tieneProyecto: false,
                proyecto: null,
                esCreador: false,
            });
        }

    } catch (error) {
        console.error('Error al verificar el proyecto del profesor:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
