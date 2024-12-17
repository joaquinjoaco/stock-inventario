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

const SalesPage = async () => {

    const sales = await prismadb.sale.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: SalesColumn[] = sales.map((sale) => ({
        "ID": sale.id.toString(),
        "Total": formatterUYU.format(sale.totalPrice.toNumber()),

        "Fecha de creación": format(sale.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Fecha de actualización": format(sale.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

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