import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data } = body

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de compras' }, { status: 400 })
        }

        // Insert all the purchases following the new format
        await Promise.all(
            data.map(async (purchase) => {
                await prismadb.purchase.create({
                    data: {
                        id: purchase.id,
                        totalCost: purchase.totalCost,
                        supplier: purchase.supplier
                    },
                })
            })
        )

        // Create all PurchaseItems related to the purchases
        // Its 1 item per purchase, so the purchaseItem cost will be the purchase total cost
        await Promise.all(
            data.map(async (purchase) => {
                await prismadb.purchaseItem.create({
                    data: {
                        // we let the id autogenerate
                        cost: purchase.totalCost / purchase.amount,
                        quantity: purchase.amount,
                        productId: purchase.productId,
                        purchaseId: purchase.id,
                    },
                })
            })
        )

        return NextResponse.json({ message: 'Compras actualizadas' }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error actualizando las compras.' }, { status: 500 })
    }
}
