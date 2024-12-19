/* eslint-disable @typescript-eslint/no-explicit-any */
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Product } from '@prisma/client';

export async function POST(req: Request, _res: Response) {
    try {
        const body = await req.json()
        const { data }: { data: Product[] } = body

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de productos' }, { status: 400 })
        }

        // Insert each product into the database
        await Promise.all(
            data.map(async (product: Product) => {
                await prismadb.product.upsert({
                    where: {
                        id: product.id
                    },
                    update: {
                        ...product,
                    },
                    create: {
                        ...product,
                    },
                });
            })
        )

        return NextResponse.json({ message: 'Inventario actualizado' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando el inventario.' }, { status: 500 })
    }
}
