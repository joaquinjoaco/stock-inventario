/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();

        const {
            name,
            description, // optional
            brand, // optional
            sellingPrice, // can be 0
            unitType,
            stock, // can be 0
            isArchived
        } = body


        // Check for the name.
        if (!name) {
            return new NextResponse("name is required", { status: 400 })
        }

        // Check for the unitType.
        if (!unitType) {
            return new NextResponse("unitType is required", { status: 400 })
        }

        // If all the checks were passed, we can create the product.
        const product = await prismadb.$transaction(async (tx) => {
            // 1. Create the product.
            const newProduct = await prismadb.product.create({
                data: {
                    name,
                    description,
                    brand,
                    sellingPrice,
                    unitType,
                    stock,
                    isArchived
                }
            })

            // 2. Log the action.
            await tx.log.create({
                data: {
                    action: "CREAR_PRODUCTO",
                    entityId: newProduct.id,
                    details: `Registro de un nuevo producto (${newProduct.name} ${newProduct.brand} ${newProduct.unitType})`,
                },
            })

            return newProduct
        })

        return NextResponse.json(product)

    } catch (error: any) {
        console.log('[INVENTARIO_POST]', error)
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }) // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}