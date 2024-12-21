import prismadb from '@/lib/prismadb';
import { SaleItem } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data }: { data: SaleItem[] } = body
        console.log(data)
        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de items de venta' }, { status: 400 })
        }

        // Insert each saleItem into the database
        await Promise.all(
            data.map(async (saleItem: SaleItem) => {
                await prismadb.saleItem.upsert({
                    where: {
                        id: saleItem.id
                    },
                    update: {
                        ...saleItem,
                    },
                    create: {
                        ...saleItem,
                    },
                });
            })
        )

        return NextResponse.json({ message: 'Ventas actualizadas' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando las ventas.' }, { status: 500 })
    }
}
