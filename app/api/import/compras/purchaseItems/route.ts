import prismadb from '@/lib/prismadb';
import { PurchaseItem } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data }: { data: PurchaseItem[] } = body
        console.log(data)
        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de items de compra' }, { status: 400 })
        }

        // Insert each purchaseItem into the database
        await Promise.all(
            data.map(async (purchaseItem: PurchaseItem) => {
                await prismadb.purchaseItem.upsert({
                    where: {
                        id: purchaseItem.id
                    },
                    update: {
                        ...purchaseItem,
                    },
                    create: {
                        ...purchaseItem,
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
