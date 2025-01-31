/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
) {
    // A new purchase record will be created and the amount will be added to the product stock.
    try {
        const body = await req.json()

        const {
            totalCost,
            supplier,
            selectedProducts,
        }: {
            totalCost: number;
            supplier: string | null;
            selectedProducts: {
                cost: number;
                quantity: number;
                name: string;
                brand: string;
                unitType: string;
                productId: string;
            }[];
        } = body

        // Check for the totalCost. no ! because 0 is a falsy value.
        if (totalCost === undefined || totalCost === null) {
            return new NextResponse("totalCost is required", { status: 400 })
        }

        // Check for the selectedProducts.
        if (!selectedProducts) {
            return new NextResponse("selectedProducts is required", { status: 400 })
        }


        // 1. If all the checks were passed, we can create the purchase.
        const purchase = await prismadb.purchase.create({
            data: {
                totalCost,
                supplier,
                purchaseItems: {
                    create: selectedProducts.map((product: { cost: number, quantity: number, name: string, brand: string, unitType: string, productId: string, }) => ({
                        cost: product.cost,
                        quantity: product.quantity,
                        product: {
                            connect: {
                                id: product.productId
                            }
                        }
                    }))
                },
            },
        })

        // 2. Add the product stock.
        // Add stock for all products in selectedProducts.
        await Promise.all(
            selectedProducts.map(async (product) => {
                // Decrease the stock for the product
                await prismadb.product.update({
                    where: { id: product.productId },
                    data: {
                        stock: {
                            increment: product.quantity, // Decrease stock by the quantity sold.
                        },
                    },
                });
            })
        );

        return NextResponse.json(purchase)

    } catch (error: any) {
        console.log('[COMPRAS_POST]', error)
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }) // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}