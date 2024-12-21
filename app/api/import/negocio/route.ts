import prismadb from '@/lib/prismadb';
import { Business } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data }: { data: Business } = body

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        await prismadb.business.upsert({
            where: {
                id: data.id,
            },
            update: {
                ...data,
            },
            create: {
                ...data,
            }
        })

        return NextResponse.json({ message: 'Información del negocio actualizada' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando la información del negocio.' }, { status: 500 })
    }
}
