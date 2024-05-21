import { NextResponse } from 'next/server';
import {conn} from '@/libs/mysql'

export function GET() {
  return NextResponse.json('listando usuarios');
}

export async function POST(request) {
  try {
    const {nombre, apellidos, numExpediente, carrera, cuatrimestre, foto,} = await request.json();

    const result = await conn.query('INSERT INTO usuarios SET ?', {
        nombre: nombre,
        apellidos: apellidos,
        numExpediente: numExpediente,
        carrera: carrera,
        cuatrimestre: cuatrimestre,
        foto: foto
    });

    console.log(result);

    return NextResponse.json({ message: 'Datos recibidos', data });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
