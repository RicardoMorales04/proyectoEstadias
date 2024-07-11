import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { proyecto_id, uid } = await req.json();

        if (!proyecto_id || !uid) {
            throw new Error('Datos inválidos proporcionados.');
        }
        
        const result = await sql`
            UPDATE usuarios SET proyecto_id = ${proyecto_id} WHERE uid = ${uid};
        `;

        console.log('Resultado de la consulta:', result);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return NextResponse.json({ error: error.message });
    }
}
