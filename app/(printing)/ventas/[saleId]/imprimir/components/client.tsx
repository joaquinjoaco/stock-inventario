"use client"

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { formatterUYU } from "@/lib/utils";
import { SerializedSale } from "@/types";
import { Business } from "@prisma/client";
import { disconnect } from "process";

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
    const discount = data?.discount ? data?.discount : 0

    return (
        <div className="p-6 bg-white text-black min-h-[100vh]">
            <div className="flex mb-8">
                <div>
                    <p className="text-xs ">{data?.createdAt ? format(data?.createdAt, "dd/MM/yy HH:mm", { locale: es }) : ""}</p>
                </div>
            </div>
            <p className="p-0 mb-1 font-bold">{business?.name}</p>
            <div className="flex flex-col text-xs">
                <p className="p-0 mb-1">RUT {business?.RUT}</p>
                <p className="p-0 mb-1">{business?.address}</p>
                <p className="p-0 mb-1">{business?.phone}</p>
            </div>

            <div className="h-px bg-gray-300 my-4" />
            <div className="space-y-4 text-xs">
                {data?.saleItems.map((item, idx) => (
                    // item
                    <li className="flex justify-between" key={idx}>
                        <div className="flex flex-row gap-x-2 items-center justify-between font-semibold">
                            {Number(item.quantity)} x {item.name}
                        </div>
                        {/* price */}
                        <div className="flex items-center mt-1 gap-x-2">
                            <p className="font-semibold">
                                {formatterUYU.format(Number(item.calculatedPrice * item.quantity))}
                            </p>
                        </div>
                    </li>
                ))}

                {discount > 0 &&
                    <li className="flex justify-between">
                        <div className="flex flex-row gap-x-2 items-center justify-between font-bold">
                            Descuento
                        </div>
                        {/* price */}
                        <div className="flex items-center mt-1 gap-x-2">
                            <p className="font-bold">
                                {formatterUYU.format(Number(data?.discount))}
                            </p>
                        </div>
                    </li>
                }

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                        <div className="text-lg font-bold">
                            Total
                        </div>
                        <div className="text-lg font-extrabold">
                            {formatterUYU.format(Number(data?.totalPrice))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImprimirVentaClient;