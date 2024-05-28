import { NextResponse } from "next/server";

export async function DELETE(request, {params}){
    const result = await conn.query('DELETE FROM usuarios WHERE id = ?', [params.id])
    return NextResponse.json('Eliminando un usuario')
}
