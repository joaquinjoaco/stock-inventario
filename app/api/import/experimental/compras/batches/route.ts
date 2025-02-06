import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data } = body;

        console.log('Total purchases to process:', data.length);

        if (!data) {
            return NextResponse.json({ error: 'No se ha recibido la información.' }, { status: 400 });
        }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: 'Formato inválido, se espera un array de compras' }, { status: 400 });
        }

        const results = {
            successful: 0,
            failed: 0,
            errors: [] as { id: string; error: string }[]
        };

        // Process purchases in smaller batches to avoid overwhelming the database
        const batchSize = 25;
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            await Promise.allSettled(
                batch.map(async (purchase) => {
                    try {
                        // Validate purchase data
                        if (!purchase.id || !purchase.totalCost || !purchase.amount || !purchase.productId) {
                            throw new Error('Missing required fields');
                        }

                        // Use transaction to ensure both purchase and purchaseItem are created or neither is
                        await prismadb.$transaction(async (tx) => {
                            await tx.purchase.create({
                                data: {
                                    id: purchase.id,
                                    totalCost: purchase.totalCost,
                                    supplier: purchase.supplier
                                },
                            });

                            await tx.purchaseItem.create({
                                data: {
                                    cost: purchase.totalCost / purchase.amount,
                                    quantity: purchase.amount,
                                    productId: purchase.productId,
                                    purchaseId: purchase.id,
                                },
                            });
                        });

                        results.successful++;
                    } catch (error: any) {
                        results.failed++;
                        results.errors.push({
                            id: purchase.id,
                            error: error.message || 'Unknown error'
                        });
                    }
                })
            );

            // Optional: Add a small delay between batches
            if (i + batchSize < data.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        console.log('Import results:', results);

        if (results.failed > 0) {
            console.log({
                message: `Proceso completado con errores. ${results.successful} exitosos, ${results.failed} fallidos.`,
                errors: results.errors
            }, { status: 207 })

            return NextResponse.json({
                message: `Proceso completado con errores. ${results.successful} exitosos, ${results.failed} fallidos.`,
                errors: results.errors
            }, { status: 207 });
        }

        console.log({
            message: `${results.successful} compras actualizadas exitosamente.`
        }, { status: 200 })
        return NextResponse.json({
            message: `${results.successful} compras actualizadas exitosamente.`
        }, { status: 200 });

    } catch (error: any) {
        console.error('Fatal error:', error.stack);
        return NextResponse.json({ error: 'Ocurrió un error actualizando las compras.' }, { status: 500 });
    }
}