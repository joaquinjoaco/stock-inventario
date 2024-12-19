"use client"

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { formatterUYU } from "@/lib/utils";
import { SerializedSale } from "@/types";
import { Business } from "@prisma/client";

interface ImprimirVentaClientProps {
    data: SerializedSale | null;
    business: Business | null;
}
const ImprimirVentaClient: React.FC<ImprimirVentaClientProps> = ({
    data,
    business,
}) => {

    if (typeof window !== 'undefined') {
        window.print();
    }

    return (
        <div className="p-8 bg-white text-black min-h-[100vh]">
            <div className="flex justify-between">
                <div className="flex pb-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Troll?</h1>
                        <p className="text-sm">{data?.createdAt ? format(data?.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }) : ""}</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="p-0 mb-1 font-bold">{business?.name}</p>
                    <p className="p-0 mb-1">{business?.address}</p>
                    <p className="p-0 mb-1">{business?.phone}</p>
                </div>
            </div>

            <div className="h-px bg-gray-300 my-4" />

            {/* <div className="flex flex-col gap-y-4">
                <div>
                    <p className="flex items-center p-0 mb-1 font-bold"> <BikeIcon className="h-4 w-4 mr-2" /> {data?.bike.brand} {data?.bike.model}</p>
                    <p className="p-0 mb-1">{data?.bike.currentOwnerName}</p>
                    <p className="p-0 mb-1">{data?.bike.currentOwnerPhone}</p>
                </div>
                <div className="">
                    <p className="font-bold text-lg">Notas del service</p>
                    <p className="text-sm">{data?.notes || "-"}</p>
                </div>
            </div> */}
            <div className="h-px bg-gray-300 my-4" />

            <div className="space-y-4">
                {/* <p className="font-bold text-lg mb-4">Detalles</p>
                <li className="flex justify-between" >
                    <div className="flex flex-row gap-x-2 items-center justify-between font-semibold">
                        <Wrench className="h-4 w-4" />{data?.serviceType.name}
                    </div>

                    <div className="flex items-center mt-1 gap-x-2">
                        <p className="font-semibold">
                            {formatterUYU.format(Number(data?.serviceCost))}
                        </p>
                    </div>
                </li> */}


                {data?.saleItems.map((item, idx) => (
                    <li className="flex justify-between" key={idx}>
                        {/* Service offerings */}
                        <div className="flex flex-row gap-x-2 items-center justify-between font-semibold">
                            {Number(item.quantity)} x {item.name}
                        </div>

                        {/* Price */}
                        <div className="flex items-center mt-1 gap-x-2">
                            <p className="font-semibold">
                                {formatterUYU.format(Number(item.calculatedPrice * item.quantity))}
                            </p>
                        </div>
                    </li>
                ))}
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                        <div className="text-xl font-bold">
                            Total
                        </div>
                        <div className="text-xl font-extrabold">
                            {formatterUYU.format(Number(data?.totalPrice))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImprimirVentaClient;