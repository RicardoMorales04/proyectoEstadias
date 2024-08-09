import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import cloudinary from '../../../../cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const uid_p = formData.get('uid_p');
        const nombre_p = formData.get('nombre_p');
        const apellidos_p = formData.get('apellidos_p');
        const foto = formData.get('foto');

        if (!foto) {
            throw new Error('Missing required parameter - file');
        }

        const buffer = Buffer.from(await foto.arrayBuffer());
        const uploadToCloudinary = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'professor_photos', public_id: uid_p },
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
            INSERT INTO profesores (uid_p, nombre_p, apellidos_p, foto_p)
            VALUES (${uid_p}, ${nombre_p}, ${apellidos_p}, ${fotoUrl})
            RETURNING profe_id;
        `;

        console.log('SQL result:', result);

        if (!result || !result.rows || result.rows.length === 0) {
            throw new Error('Error retrieving inserted professor');
        }

        return NextResponse.json({
            uid_p,
            nombre_p,
            apellidos_p,
            foto_p: fotoUrl,
            profe_id: result.rows[0].profe_id,
        });
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        return NextResponse.json({ message: 'Error al procesar la solicitud.' }, { status: 500 });
    }
}
