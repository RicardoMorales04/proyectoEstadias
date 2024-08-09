import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { uid, proyecto_id } = await req.json();

    if (!uid || !proyecto_id) {
      throw new Error('UID y proyecto_id son obligatorios.');
    }

    // Obtener el profe_id basado en el uid
    const { rows: profesores } = await sql`
      SELECT profe_id FROM profesores WHERE uid_p = ${uid};
    `;

    if (profesores.length === 0) {
      // El UID no corresponde a un profesor
      return NextResponse.json({
        esProfesor: false,
        esCreador: false,
      });
    }

    const profe_id = profesores[0].profe_id;

    // Verificar si el profesor es el creador del proyecto
    const { rows: proyectos } = await sql`
      SELECT proyecto_id FROM proyectos WHERE profe_id = ${profe_id} AND proyecto_id = ${proyecto_id};
    `;

    if (proyectos.length > 0) {
      // El profesor es el creador del proyecto
      return NextResponse.json({
        esProfesor: true,
        esCreador: true,
      });
    } else {
      // El profesor no es el creador del proyecto
      return NextResponse.json({
        esProfesor: true,
        esCreador: false,
      });
    }

  } catch (error) {
    console.error('Error al verificar si el usuario es profesor y creador del proyecto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
