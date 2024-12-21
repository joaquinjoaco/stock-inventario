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

const PurchasesPage = async (
    props: {
        searchParams: Promise<{ filter: 'MONTHLY' | 'WEEKLY' | 'DAILY' }>
    }
) => {

    const searchParams = await props.searchParams // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const { filter } = searchParams
    const today = new Date()

    let purchases

    if (filter === "MONTHLY") {
        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        purchases = await prismadb.purchase.findMany({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
            include: {
                product: true,
            }
        });
    } else if (filter === "WEEKLY") {
        // Calculate the start and end of the current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Start of day

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday
        endOfWeek.setMilliseconds(-1); // End of the current week

        purchases = await prismadb.purchase.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lt: endOfWeek,
                },
            },
            include: {
                product: true,
            }
        });
    } else if (filter === "DAILY") {
        purchases = await prismadb.purchase.findMany({
            where: {
                // for purchases its ok to use createdAt and not updatedAt.
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),  // Local start of day
                    lt: new Date(today.setHours(23, 59, 59, 999)), // Local end of day
                },
            },
            include: {
                product: true,
            }
        })
    } else {
        // All purchases
        purchases = await prismadb.purchase.findMany({
            include: {
                product: true,
            }
        });
    }

    const formattedProducts: PurchaseColumn[] = purchases.map((purchase) => ({
        "ID": purchase.id,
        "Nombre del producto": purchase.product.name,
        "Cantidad": `${purchase.amount.toNumber()} ${purchase.product.unitType === 'PESO' ? 'KG' : 'UNIDADES'}`,
        "Costo total": formatterUYU.format(purchase.totalCost.toNumber()),
        "Tipo": purchase.product.unitType,
        "Proveedor": purchase.supplier || "-",
        "Fecha de creación": format(purchase.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }),
        "Fecha de actualización": format(purchase.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es })
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