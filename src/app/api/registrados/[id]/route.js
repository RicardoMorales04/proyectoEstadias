import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'ID is missing in route parameters' }, { status: 400 });
        }

        const proyectoId = String(id);

        const { rows: usuarios } = await sql`
            SELECT 
                usuario_id, nombre, apellidos, numexpediente, carrera, cuatrimestre, fecha_inscripcion 
            FROM usuarios 
            WHERE proyecto_id = ${proyectoId};
        `;

        return NextResponse.json(usuarios);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
