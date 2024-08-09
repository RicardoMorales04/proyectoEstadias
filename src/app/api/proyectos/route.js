import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { rows: proyectos } = await sql`
            SELECT p.proyecto_id, p.nombre AS proyecto_nombre, p.descripcion, p.horario, 
                   pr.nombre_p AS profesor_nombre, pr.apellidos_p AS profesor_apellidos 
            FROM proyectos p 
            LEFT JOIN profesores pr ON p.profe_id = pr.profe_id;
        `;
        return NextResponse.json(proyectos);
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}

export async function POST(request) {
    const { uid } = await request.json();
    
    if (!uid) {
        return NextResponse.json({ error: 'No se proporcionó UID' });
    }

    try {
        const { rows: result } = await sql`
            SELECT p.nombre AS proyecto_nombre 
            FROM usuarios u 
            JOIN proyectos p ON u.proyecto_id = p.proyecto_id 
            WHERE u.uid = ${uid};
        `;

        if (result.length > 0) {
            return NextResponse.json({ proyecto: result[0] });
        } else {
            return NextResponse.json({ proyecto: null });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
