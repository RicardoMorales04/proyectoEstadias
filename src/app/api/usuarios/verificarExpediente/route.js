import { NextResponse } from 'next/server';
import { query } from '@/libs/mysql';

export async function POST(request) {
    try {
        const { numExpediente } = await request.json();

        const result = await query("SELECT * FROM usuarios WHERE numExpediente = ?", [numExpediente]);

        if (result.length > 0) {
            return NextResponse.json({ exists: true });
        } else {
            return NextResponse.json({ exists: false });
        }
    } catch (err) {
        console.error('Error al verificar el número de expediente:', err);
        return NextResponse.json({ message: 'Error al verificar el número de expediente.' }, { status: 500 });
    }
}
