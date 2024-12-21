import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

import { SalesClient } from "./components/client";
import { SalesColumn } from "./components/columns";
import { es } from "date-fns/locale";
import { Header } from "@/components/ui/header";


export const metadata = {
    title: "Ventas",
}

const SalesPage = async (
    props: {
        searchParams: Promise<{ filter: 'MONTHLY' | 'WEEKLY' | 'DAILY' }>
    }
) => {

    const searchParams = await props.searchParams // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const { filter } = searchParams

    const today = new Date()

    let sales
    if (filter === "MONTHLY") {
        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        sales = await prismadb.sale.findMany({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });
    } else if (filter === "WEEKLY") {
        // Calculate the start and end of the current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Start of day

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday
        endOfWeek.setMilliseconds(-1); // End of the current week

        sales = await prismadb.sale.findMany({
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lt: endOfWeek,
                },
            },
        });
    } else if (filter === "DAILY") {
        sales = await prismadb.sale.findMany({
            where: {
                // for purchases its ok to use createdAt and not updatedAt.
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),  // Local start of day
                    lt: new Date(today.setHours(23, 59, 59, 999)), // Local end of day
                },
            },
        })
    } else {
        // All sales
        sales = await prismadb.sale.findMany();
    }

    const formattedProducts: SalesColumn[] = sales.map((sale) => ({
        "ID": sale.id,
        "Total": formatterUYU.format(sale.totalPrice.toNumber()),
        "Método de pago": sale.paymentType.toString(),
        "Fecha de creación": format(sale.createdAt, "dd MMMM, yyyy HH:mm", { locale: es }),
        "Fecha de actualización": format(sale.updatedAt, "dd MMMM, yyyy HH:mm", { locale: es })
    }))

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Ventas',
            url: '/ventas'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <SalesClient data={formattedProducts} />
                </div>
            </div>
        </>
    );
}

export default SalesPage;