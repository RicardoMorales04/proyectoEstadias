import { conn } from '@/libs/mysql';

export default async function handlerPOST(req, res) {
    if (req.method === 'POST') {
        const { titulo, contenido, autor_id, autor_tipo } = req.body;

        try {
            const db = await conn();

            const [result] = await db.query(
                'INSERT INTO blog (titulo, contenido, profesor_id, usuario_id) VALUES (?, ?, ?, ?)',
                [titulo, contenido, autor_tipo === 'profesor' ? autor_id : null, autor_tipo === 'usuario' ? autor_id : null]
            );

            res.status(201).json({ blog_id: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el artículo' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default async function handlerGET(req, res) {
    if (req.method === 'GET') {
        try {
            const db = await conn();
            const [rows] = await db.query('SELECT * FROM blog ORDER BY fecha_publicacion DESC');
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los artículos' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
