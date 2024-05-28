import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';

export async function GET() {
    try {
        const result = await conn.query('SELECT * FROM usuarios')
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({
            message: err.message,
        },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request) {
    try {
        //const {nombre, apellidos, numExpediente, carrera, cuatrimestre, foto} = await request.formData();
        const formData = await request.formData();
        const nombre = formData.get('nombre');
        const apellidos = formData.get('apellidos');
        const numExpediente = formData.get('numExpediente');
        const carrera = formData.get('carrera');
        const cuatrimestre = formData.get('cuatrimestre');
        const foto = formData.get('foto');
        
        const result = await conn.query("INSERT INTO usuarios SET ?", {
            nombre, 
            apellidos, 
            numExpediente, 
            carrera, 
            cuatrimestre,
            foto
        });

        return NextResponse.json({
            nombre, 
            apellidos, 
            numExpediente, 
            carrera, 
            cuatrimestre,
            foto,
            id: result.insertId,
        })
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                message: err.message
            }
        )
    }
}
