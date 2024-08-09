import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { uid } = await req.json();

        if (!uid) {
            throw new Error('UID no proporcionado en el cuerpo de la solicitud');
        }

        // Consulta en la tabla de profesores si el UID corresponde a un profesor
        const { rows: profesores } = await sql`
            SELECT 
                profe_id, nombre_p, apellidos_p 
            FROM profesores 
            WHERE uid_p = ${uid};
        `;

        if (profesores.length > 0) {
            // Si hay registros, el usuario es un profesor
            return NextResponse.json({ esProfesor: true });
        } else {
            // Si no hay registros, el usuario no es un profesor
            return NextResponse.json({ esProfesor: false });
        }
    } catch (error) {
        console.error('Error al verificar si el usuario es profesor:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
