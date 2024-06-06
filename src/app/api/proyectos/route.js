import { query } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const proyectos = await query(`SELECT p.proyecto_id, p.nombre AS proyecto_nombre, p.descripcion, p.horario, 
    pr.nombre AS profesor_nombre, pr.apellidos AS profesor_apellidos FROM proyectos p LEFT JOIN profesores pr ON p.profesor_id = pr.prof_id
    `);
    return NextResponse.json(proyectos);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
