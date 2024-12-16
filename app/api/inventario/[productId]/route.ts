/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

type Params = Promise<{ productId: string }>

export async function PATCH(
    req: Request,
    segmentData: { params: Params } // comes from [productId]
) {
    try {

        const params = await segmentData.params
        const productId = params.productId

        // Check for the productId.
        if (!productId) {
            return new NextResponse("productId is required", { status: 400 });
        }

        const body = await req.json();
        console.log(body)
        const {
            name,
            description, // optional
            brand, // optional
            sellingPrice, // can be 0 
            unitType,
            stock, // can be 0
            isArchived
        } = body;


        // Check for the name.
        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }

        // // Check for the sellingPrice.
        // if (!sellingPrice) {
        //     return new NextResponse("sellingPrice is required", { status: 400 });
        // }

        // Check for the unitType.
        if (!unitType) {
            return new NextResponse("unitType is required", { status: 400 });
        }

        // Update the product.
        const product = await prismadb.product.update({
            where: {
                id: Number(productId)
            },
            data: {
                name,
                description,
                brand,
                sellingPrice,
                unitType,
                stock,
                isArchived
            }
        });

        return NextResponse.json(product);

    } catch (error: any) {
        console.log('[INVENTARIO_PATCH]', error);
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }); // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }
}


export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    segmentData: { params: Params } // comes from [productId]
) {
    try {

        const params = await segmentData.params
        const productId = params.productId

        // Check for the productId.
        if (!productId) {
            return new NextResponse("productId is required", { status: 400 });
        }

        const book = await prismadb.product.deleteMany({
            where: {
                id: Number(productId),
            }
        });

        return NextResponse.json(book);
    } catch (error: any) {
        console.log('[INVENTARIO_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}