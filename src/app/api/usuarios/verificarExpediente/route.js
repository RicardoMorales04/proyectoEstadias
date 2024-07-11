import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request) {
    try {
        const { numExpediente } = await request.json();

        if (!numExpediente) {
            return NextResponse.json({ message: 'numExpediente es requerido' }, { status: 400 });
        }

        const result = await sql`
            SELECT * FROM usuarios WHERE numExpediente = ${numExpediente};
        `;

        if (result.rowCount > 0) {
            return NextResponse.json({ exists: true });
        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (err) {
        console.error('Error al verificar el número de expediente:', err);
        return NextResponse.json({ message: 'Error al verificar el número de expediente.' }, { status: 500 });
    }
}

