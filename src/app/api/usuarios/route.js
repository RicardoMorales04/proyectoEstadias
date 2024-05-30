import { NextResponse } from 'next/server';
import { conn, query } from '@/libs/mysql';

export async function GET() {
    try {
      const result = await query('SELECT * FROM usuarios');
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
  
  export async function POST(request) {
    try {
      const { usuario, numExpediente } = await request.json();
      const result = await query('SELECT * FROM usuarios WHERE usuario = ? AND numExpediente = ?', [usuario, numExpediente]);
  
      if (result.length === 0) {
        return NextResponse.json({ message: 'Usuario o Numero de Expediente incorrectos' }, { status: 401 });
      }
  
      return NextResponse.json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
  
  export async function PUT(request) {
    try {
      const formData = await request.formData();
      const usuario = formData.get('usuario');
      const nombre = formData.get('nombre');
      const apellidos = formData.get('apellidos');
      const numExpediente = formData.get('numExpediente');
      const carrera = formData.get('carrera');
      const cuatrimestre = formData.get('cuatrimestre');
      const foto = formData.get('foto');
      
      const result = await query("INSERT INTO usuarios SET ?", {
        usuario,
        nombre,
        apellidos,
        numExpediente,
        carrera,
        cuatrimestre,
        foto
      });
  
      return NextResponse.json({
        usuario,
        nombre,
        apellidos,
        numExpediente,
        carrera,
        cuatrimestre,
        foto,
        id: result.insertId,
      });
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
