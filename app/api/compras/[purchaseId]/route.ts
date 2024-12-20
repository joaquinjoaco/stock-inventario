/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

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

        const purchase = await prismadb.purchase.deleteMany({
            where: {
                id: purchaseId,
            }
        });

        return NextResponse.json(purchase);
    } catch (error: any) {
        console.log('[COMPRAS_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}