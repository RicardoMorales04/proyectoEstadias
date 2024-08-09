import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { nombre, descripcion, horario, uid } = await req.json();

        // Validar campos requeridos
        if (!nombre || !descripcion || !horario || !uid) {
            throw new Error('Todos los campos son obligatorios: nombre, descripción, horario y uid');
        }

        // Obtener el profe_id basado en el uid
        const { rows: profesores } = await sql`
            SELECT profe_id FROM profesores WHERE uid_p = ${uid};
        `;

        if (profesores.length === 0) {
            throw new Error('No se encontró un profesor con el UID proporcionado.');
        }

        const profe_id = profesores[0].profe_id;

        // Insertar el proyecto con el profe_id
        const { rows } = await sql`
            INSERT INTO proyectos (nombre, descripcion, horario, profe_id)
            VALUES (${nombre}, ${descripcion}, ${horario}, ${profe_id})
            RETURNING proyecto_id, nombre, descripcion, horario;
        `;

        const nuevoProyecto = rows[0];

        return NextResponse.json({
            message: 'Proyecto creado exitosamente',
            proyecto: nuevoProyecto,
        });

    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
