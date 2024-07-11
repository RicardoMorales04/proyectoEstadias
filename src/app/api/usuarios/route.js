import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import cloudinary from '../../../../cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const uid = formData.get('uid');
        const nombre = formData.get('nombre');
        const apellidos = formData.get('apellidos');
        const numExpediente = formData.get('numExpediente');
        const carrera = formData.get('carrera');
        const cuatrimestre = formData.get('cuatrimestre');
        const foto = formData.get('foto');

        if (!foto) {
            throw new Error('Missing required parameter - file');
        }

        const buffer = Buffer.from(await foto.arrayBuffer());
        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'user_photos', public_id: uid },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
        };

        const uploadResponse = await uploadToCloudinary(buffer);

        if (!uploadResponse || !uploadResponse.secure_url) {
            throw new Error('Error uploading image to Cloudinary');
        }

        const fotoUrl = uploadResponse.secure_url;

        const result = await sql`
            INSERT INTO usuarios (uid, nombre, apellidos, numExpediente, carrera, cuatrimestre, foto)
            VALUES (${uid}, ${nombre}, ${apellidos}, ${numExpediente}, ${carrera}, ${cuatrimestre}, ${fotoUrl})
            RETURNING usuario_id;
        `;

        console.log('SQL result:', result);

        if (!result || !result.rows || result.rows.length === 0) {
            throw new Error('Error retrieving inserted user');
        }

        return NextResponse.json({
            uid,
            nombre,
            apellidos,
            numExpediente,
            carrera,
            cuatrimestre,
            foto: fotoUrl,
            id: result.rows[0].usuario_id,
        });
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        return NextResponse.json({ message: 'Error al procesar la solicitud.' }, { status: 500 });
    }
}
