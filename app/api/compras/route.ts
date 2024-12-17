/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
) {
    // A new purchase record will be create and the amount will be added to the product stock.
    try {
        const body = await req.json()

        const {
            totalCost, // can be 0
            amount,
            supplier, // optional
            productId,
        } = body


        // Check for the amount.
        if (!amount) {
            return new NextResponse("name is required", { status: 400 })
        }

        // Check for the productId.
        if (!productId) {
            return new NextResponse("productId is required", { status: 400 })
        }


        // 1. If all the checks were passed, we can create the purchase.
        const purchase = await prismadb.purchase.create({
            data: {
                totalCost,
                amount,
                supplier,
                productId: Number(productId),
            },
        })

        // 2. Add the product stock.
        await prismadb.product.update({
            where: {
                id: Number(productId)
            },
            data: {
                stock: {
                    increment: amount
                }
            }
        })

        return NextResponse.json(purchase)

    } catch (error: any) {
        console.log('[COMPRAS_POST]', error)
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }) // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}