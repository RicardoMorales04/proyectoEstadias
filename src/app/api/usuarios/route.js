import { NextResponse } from 'next/server';
import { query } from '@/libs/mysql';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const uid = formData.get('uid');
        const nombre = formData.get('nombre');
        const apellidos = formData.get('apellidos');
        const numExpediente = formData.get('numExpediente');
        const carrera = formData.get('carrera');
        const cuatrimestre = formData.get('cuatrimestre');
        const foto = formData.get('foto');

        const [expedienteResult] = await query("SELECT COUNT(*) AS count FROM usuarios WHERE numExpediente = ?", [numExpediente]);
        if (expedienteResult.count > 0) {
            return NextResponse.json({ message: 'El número de expediente ya está en uso.' }, { status: 400 });
        }

        const result = await query("INSERT INTO usuarios SET ?", {
            uid,
            nombre,
            apellidos,
            numExpediente,
            carrera,
            cuatrimestre,
            foto
        });

        return NextResponse.json({
            uid,
            nombre,
            apellidos,
            numExpediente,
            carrera,
            cuatrimestre,
            foto,
            id: result.insertId,
        });
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        return NextResponse.json({ message: 'Error al procesar la solicitud.' }, { status: 500 });
    }
}
