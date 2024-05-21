import { NextResponse } from 'next/server';
import { conn } from '@/libs/mysql';

export async function GET() {
  try {
    const [rows] = await conn.query('SELECT * FROM usuarios');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
    try {
        const data = await request.formData();
        const image = data.get("foto");

        if (!data.get("nombre")) {
            return NextResponse.json(
                {
                    message: "Nombre es requerido",
                },
                {
                    status: 400,
                }
            );
        }

        if (!image) {
            return NextResponse.json(
                {
                    message: "Imagen es requerida",
                },
                {
                    status: 400,
                }
            );
        }

        const imageBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);

        const result = await conn.query("INSERT INTO usuarios SET ?", {
            nombre: data.get("nombre"),
            apellidos: data.get("apellidos"),
            numExpediente: data.get("numExpediente"),
            carrera: data.get("carrera"),
            cuatrimestre: data.get("cuatrimestre"),
            foto: buffer,
        });

        return NextResponse.json({
            nombre: data.get("nombre"),
            apellidos: data.get("apellidos"),
            numExpediente: data.get("numExpediente"),
            carrera: data.get("carrera"),
            cuatrimestre: data.get("cuatrimestre"),
            id: result.insertId,
        });
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
