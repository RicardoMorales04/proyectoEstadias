import { conn } from '@/libs/mysql';

export async function GET(req, res) {
    try {
        const db = await conn();
        const [rows] = await db.query('SELECT * FROM blog ORDER BY fecha_publicacion DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        res.status(500).json({ error: 'Error al obtener los artículos' });
    }
}
