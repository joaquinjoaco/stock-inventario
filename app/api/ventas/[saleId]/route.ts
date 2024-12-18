/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

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

        // 1. Delete all related SaleItems.
        await prismadb.saleItem.deleteMany({
            where: {
                saleId: Number(saleId),
            }
        });

        // 2. Delete the sale.
        const sale = await prismadb.sale.delete({
            where: {
                id: Number(saleId)
            }
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