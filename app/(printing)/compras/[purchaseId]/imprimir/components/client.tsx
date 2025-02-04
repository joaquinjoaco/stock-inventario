"use client"

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { formatterUYU } from "@/lib/utils";
import { SerializedPurchase } from "@/types";
import { Business } from "@prisma/client";

interface ImprimirCompraClientProps {
    data: SerializedPurchase | null;
    business: Business | null;
}
const ImprimirCompraClient: React.FC<ImprimirCompraClientProps> = ({
    data,
    business,
}) => {

    if (typeof window !== 'undefined') {
        window.print();
    }

    return (
        <div className="p-6 bg-white text-black min-h-[100vh]">
            <div className="flex mb-8">
                <div>
                    <p className="text-xs">{data?.createdAt ? format(data?.createdAt, "dd/MM/yy HH:mm", { locale: es }) : ""}</p>
                </div>
            </div>
            <p className="p-0 mb-1 font-bold">Compra</p>

            <div className="h-px bg-gray-300 my-4" />
            <div className="space-y-4 text-xs">
                {data?.purchaseItems.map((item, idx) => (
                    // item
                    <li className="flex justify-between" key={idx}>
                        <div className="flex flex-row gap-x-2 items-center justify-between font-semibold">
                            {Number(item.quantity)} x {item.name}
                        </div>
                        {/* price */}
                        <div className="flex items-center mt-1 gap-x-2">
                            <p className="font-semibold">
                                {formatterUYU.format(Number(item.cost * item.quantity))}
                            </p>
                        </div>
                    </li>
                ))}

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                        <div className="text-lg font-bold">
                            Total
                        </div>
                        <div className="text-lg font-extrabold">
                            {formatterUYU.format(Number(data?.totalCost))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImprimirCompraClient;