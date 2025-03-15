/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

type Params = Promise<{ id: string }>

export async function PATCH(
    req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    segmentData: { params: Params } // comes from [id]
) {
    try {

        const params = await segmentData.params
        const id = params.id

        // Check for the id.
        if (!id) {
            return new NextResponse("id is required", { status: 400 });
        }

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

        const businessInfo = await prismadb.$transaction(async (tx) => {
            const business = await tx.business.update({
                where: {
                    id: id,
                },
                data: {
                    name,
                    RUT,
                    address,
                    phone,
                }
            })

            // Log the action.
            await tx.log.create({
                data: {
                    action: "ACTUALIZAR_NEGOCIO",
                    entityId: business.id,
                    details: `Actualización de la información del negocio`,
                    // detailsJSON: newPurchase
                },
            })

            return business
        })

        return NextResponse.json(businessInfo);
    } catch (error: any) {
        console.log('[VENTAS_DELETE]', error);
        if (error.code === 'P2003') {
            return new NextResponse("fk-constraint-failed", { status: 409 }); // FK constraint failed.
        }
        return new NextResponse("Internal error", { status: 500 });
    }

}