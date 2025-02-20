/* eslint-disable @typescript-eslint/no-explicit-any */

import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { data } = body

        if (!data) {
            return NextResponse.json({ error: '[CONVERTER] No se ha recibido la información.' }, { status: 400 })
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: '[CONVERTER] Formato inválido, se espera un array de compras' }, { status: 400 })
        }

        // Check for duplicate IDs before starting any database operations
        const hasDuplicateIds = (data: any[]) => {
            const uniqueIds = new Set(data.map(item => item.id))
            return uniqueIds.size !== data.length
        }

        if (hasDuplicateIds(data)) {
            return NextResponse.json({ error: '[CONVERTER] IDs duplicados detectados' }, { status: 400 })
        }

        // Use a transaction to ensure all-or-nothing operations
        const result = await prismadb.$transaction(async (tx) => {
            const results = []

            for (const purchase of data) {
                try {
                    const createdPurchase = await tx.purchase.create({
                        data: {
                            id: purchase.id,
                            totalCost: purchase.totalCost,
                            supplier: purchase.supplier
                        },
                    })

                    const createdPurchaseItem = await tx.purchaseItem.create({
                        data: {
                            cost: purchase.totalCost / purchase.amount,
                            quantity: purchase.amount,
                            productId: purchase.productId,
                            purchaseId: purchase.id,
                        },
                    })

                    results.push({
                        success: true,
                        purchase: createdPurchase,
                        purchaseItem: createdPurchaseItem
                    })
                } catch (error: any) {
                    // Log the error with the specific purchase that failed
                    console.error(`[CONVERTER] Error al crear la compra: ${purchase.id}`, ' Código', error.code);
                    // Throw error to trigger transaction rollback
                    throw error;
                }
            }

            return results;
        });

        return NextResponse.json({
            message: '[CONVERTER] Compras actualizadas',
            results: result
        }, { status: 200 });

    } catch (error: any) {
        console.error('[CONVERTER] Error en la transacción:', error.stack);
        return NextResponse.json({
            error: '[CONVERTER] Ocurrió un error actualizando las compras.',
            details: error.message
        }, { status: 500 });
    }
}