/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from '@/lib/prismadb';
import { Sale } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request, _res: Response) {
    try {
        const body = await req.json()
        const { data }: { data: Sale[] } = body

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de ventas' }, { status: 400 })
        }


        // Insert each sale into the database
        await Promise.all(
            data.map(async (sale: Sale) => {
                await prismadb.sale.upsert({
                    where: {
                        id: sale.id
                    },
                    update: {
                        ...sale,
                    },
                    create: {
                        ...sale,
                    },
                });
            })
        )
        // sale items shall be inserted in a separate request after this one

        return NextResponse.json({ message: 'Ventas actualizadas' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando las ventas.' }, { status: 500 })
    }
}
