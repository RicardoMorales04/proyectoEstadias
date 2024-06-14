import { conn } from '@/libs/mysql';

export async function GET(req, res) {
    try {
        const db = await conn(); // Conectar a la base de datos
        const [rows] = await db.query('SELECT * FROM blog ORDER BY fecha_publicacion DESC'); // Consultar los artículos ordenados por fecha de publicación descendente
        res.status(200).json(rows); // Devolver los artículos como respuesta JSON
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        res.status(500).json({ error: 'Error al obtener los artículos' }); // Manejar errores y devolver un mensaje de error en caso de fallo
    }
}
