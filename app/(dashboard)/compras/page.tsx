import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

import { PurchaseClient } from "./components/client";
import { PurchaseColumn as PurchaseColumn } from "./components/columns";
import { es } from "date-fns/locale";
import { Header } from "@/components/ui/header";


export const metadata = {
    title: "Compras",
}

const PurchasesPage = async () => {

    const purchases = await prismadb.purchase.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            product: true,
        }
    });

    const formattedProducts: PurchaseColumn[] = purchases.map((purchase) => ({
        "ID": purchase.id,
        "Nombre del producto": purchase.product.name,
        "Cantidad": `${purchase.amount.toNumber()} ${purchase.product.unitType === 'PESO' ? 'KG' : 'UNIDADES'}`,
        "Costo total": formatterUYU.format(purchase.totalCost.toNumber()),
        "Tipo": purchase.product.unitType,
        "Proveedor": purchase.supplier || "-",
        "Fecha de creación": format(purchase.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Fecha de actualización": format(purchase.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Compras',
            url: '/compras'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <PurchaseClient data={formattedProducts} />
                </div>
            </div>
        </>
    );
}

export default PurchasesPage;