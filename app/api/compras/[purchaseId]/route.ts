/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

type Params = Promise<{ purchaseId: string }>

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    segmentData: { params: Params } // comes from [purchaseId]
) {
    try {

        const params = await segmentData.params
        const purchaseId = params.purchaseId

        // Check for the purchaseId.
        if (!purchaseId) {
            return new NextResponse("purchaseId is required", { status: 400 });
        }

        const purchaseItems = await prismadb.purchaseItem.findMany({
            where: {
                purchaseId: purchaseId,
            },
            include: {
                product: true,
            }
        })

        const purchase = await prismadb.$transaction(async (tx) => {
            // 1. Subtract the stock.
            await Promise.all(
                purchaseItems.map((item) => {
                    return tx.product.update({
                        where: {
                            id: item.productId
                        },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    })
                })
            )

            // 2. Delete all related purchaseItems. 
            await tx.purchaseItem.deleteMany({
                where: {
                    purchaseId: purchaseId,
                }
            })

            // 3. Delete the purchase.
            const deletedPurchase = await tx.purchase.delete({
                where: {
                    id: purchaseId,
                }
            })

            // 4. Log the action.
            await tx.log.create({
                data: {
                    action: "ELIMINAR_COMPRA",
                    entityId: deletedPurchase.id,
                    details: `Compra de${purchaseItems.map((item) => ` (${item.quantity}) ${item.product.name} ${item.product.brand}`)} por un total de ${formatterUYU.format(Number(deletedPurchase.totalCost))}`,
                    // detailsJSON: deletedPurchase
                },
            })
            return deletedPurchase
        })

        return NextResponse.json(purchase);
    } catch (error: any) {
        console.log('[COMPRAS_DELETE]', error.message);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}