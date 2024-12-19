/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from '@/lib/prismadb';
import { Purchase } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request, _res: Response) {
    try {
        const body = await req.json()
        const { data }: { data: Purchase[] } = body

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de compras' }, { status: 400 })
        }

        await Promise.all(
            data.map(async (purchase: Purchase) => {
                await prismadb.purchase.upsert({
                    where: {
                        id: purchase.id
                    },
                    update: {
                        ...purchase,
                    },
                    create: {
                        ...purchase,
                    },
                });
            })
        )

        return NextResponse.json({ message: 'Compras actualizadas' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando las compras.' }, { status: 500 })
    }
}
