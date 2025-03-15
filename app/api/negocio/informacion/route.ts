/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json()

        const {
            name,
            RUT, // optional
            address, // optional
            phone, // optional
        } = body

        if (!name) {
            return new NextResponse("name is required", { status: 400 })
        }

        // Find the first and only row.
        const business = await prismadb.business.findFirst({})

        const businessInformation = await prismadb.$transaction(async (tx) => {
            let businessInfo
            if (!business) {
                // If no such row exists then it might be the first time the user is setting up the business information.
                businessInfo = await tx.business.create({
                    data: {
                        name,
                        RUT,
                        address,
                        phone,
                    }
                })
            } else {
                // If the row exists then we update the existing row.
                businessInfo = await tx.business.update({
                    where: {
                        id: business.id
                    },
                    data: {
                        name,
                        RUT,
                        address,
                        phone,
                    }
                })
            }

            // Log the action.
            await tx.log.create({
                data: {
                    action: "ACTUALIZAR_NEGOCIO",
                    entityId: businessInfo.id,
                    details: `Actualización de la información del negocio`,
                    // detailsJSON: newPurchase
                },
            })

            return businessInfo
        })

        return NextResponse.json(businessInformation);

    } catch (error: any) {
        console.log('[NEGOCIO_INFORMACION_POST]', error)
        if (error.code === 'P2002') {
            return new NextResponse("Unique constraint failed", { status: 409 }) // likely unique constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 })
    }
}