/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { PaymentType } from "@prisma/client";

export async function POST(
    req: Request,
) {
    // A new sale record will be created and the amount will be subtracted from the product stock.
    try {
        const body = await req.json()

        const {
            totalPrice,
            discount,
            paymentType,
            selectedProducts,
        }: {
            totalPrice: number;
            discount: number;
            paymentType: PaymentType;
            selectedProducts: {
                calculatedPrice: number;
                quantity: number;
                name: string;
                brand: string;
                unitType: string;
                productId: string;
            }[];
        } = body


        // Check for the totalPrice.
        if (!totalPrice) {
            return new NextResponse("totalPrice is required", { status: 400 })
        }

        // Check for the paymentType.
        if (!paymentType) {
            return new NextResponse("paymentType is required", { status: 400 })
        }

        // Check for the selectedProducts.
        if (!selectedProducts) {
            return new NextResponse("selectedProducts is required", { status: 400 })
        }


        // 1. If all the checks were passed, we can subtract the product's stock.
        // Subtract stock for all products in selectedProducts.
        await Promise.all(
            selectedProducts.map(async (product) => {
                // Decrease the stock for the product
                await prismadb.product.update({
                    where: { id: product.productId },
                    data: {
                        stock: {
                            decrement: product.quantity, // Decrease stock by the quantity sold.
                        },
                    },
                });
            })
        );
        // 2. Create the sale and the SaleItems
        const sale = await prismadb.sale.create({
            data: {
                totalPrice: totalPrice,
                discount: discount,
                paymentType: paymentType,
                saleItems: {
                    create: selectedProducts.map((product: { calculatedPrice: number, quantity: number, name: string, brand: string, unitType: string, productId: string, }) => ({
                        calculatedPrice: product.calculatedPrice,
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

        return NextResponse.json(sale)

    } catch (error: any) {
        console.log('[VENTAS_POST]', error)
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }) // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}