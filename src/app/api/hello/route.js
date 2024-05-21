import { NextResponse } from "next/server";
import { conn } from '@/libs/mysql';

export async function GET() {
    try {
        const result = await conn.query('SELECT * FROM profesores');
        console.log(result);
        return NextResponse.json({ message: result[0] });
    } catch (err) {
        console.error("Error al ejecutar la consulta:", err);
        return NextResponse.error(new Error("Hubo un error al obtener los datos."));
    }
}



