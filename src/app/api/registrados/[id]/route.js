import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        if (!id) {
            throw new Error('ID is missing in route parameters');
        }

        const usuarios = await sql`
            SELECT 
                u.usuario_id, u.nombre, u.apellidos, u.numExpediente, u.carrera, u.cuatrimestre, u.fecha_inscripcion 
            FROM usuarios u 
            WHERE u.proyecto_id = ${id};
        `;

        return NextResponse.json(usuarios);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
