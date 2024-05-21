import { NextResponse } from "next/server";

export function GET(){
    return NextResponse.json('Obteniendo un usuario')
}

export function DELETE(){
    return NextResponse.json('Eliminando un usuario')
}

export function PUT(){
    return NextResponse.jsno('Actualizando usuario')
}