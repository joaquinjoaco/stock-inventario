/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

type Params = Promise<{ saleId: string }>

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    segmentData: { params: Params } // comes from [saleId]
) {
    try {

        const params = await segmentData.params
        const saleId = params.saleId

        // Check for the saleId.
        if (!saleId) {
            return new NextResponse("saleId is required", { status: 400 });
        }

        const saleItems = await prismadb.saleItem.findMany({
            where: {
                saleId: saleId,
            },
            include: {
                product: true
            }
        })

        const sale = await prismadb.$transaction(async (tx) => {
            // 1. Re-add the stock.
            await Promise.all(
                saleItems.map((item) => {
                    return tx.product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stock: {
                                increment: item.quantity
                            }
                        }
                    })
                })
            )

            // 2. Delete all related SaleItems.
            await tx.saleItem.deleteMany({
                where: {
                    saleId: saleId,
                }
            });

            // 3. Delete the sale.
            const sale = await tx.sale.delete({
                where: {
                    id: saleId
                }
            })

            // 3. Log the action.
            await tx.log.create({
                data: {
                    action: "ELIMINAR_VENTA",
                    entityId: sale.id,
                    details: `Eliminación de la venta de${saleItems.map((item) => ` (${item.quantity} ${item.product.unitType}) ${item.product.name} ${item.product.brand}`)} por un total de ${formatterUYU.format(Number(sale.totalPrice))}`,

                },
            })

            return sale
        })
        return NextResponse.json(sale);
    } catch (error: any) {
        console.log('[VENTAS_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}