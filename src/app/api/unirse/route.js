import { getSession } from 'next-auth/react';
import { conn } from '@/libs/mysql';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const { proyecto_id } = req.body;
    const usuario = session.user;

    try {
      await conn.query('UPDATE usuarios SET proyecto_id = ? WHERE usuario = ?', [proyecto_id, usuario.name]);
      return res.status(200).json({ proyecto_id });
    } catch (error) {
      console.error('Error al unirse al proyecto:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}

