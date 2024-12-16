import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { es } from "date-fns/locale";
import { Header } from "@/components/ui/header";


export const metadata = {
    title: "Inventario",
}

const ProductsPage = async () => {

    const products = await prismadb.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((product) => ({
        "ID": product.id.toString(),
        "Nombre": product.name,
        "Precio de venta": formatterUYU.format(product.sellingPrice.toNumber()),
        "Stock": product.stock.toNumber(),
        "Unidad": product.unitType === 'PESO' ? 'PESO (KG)' : product.unitType.toUpperCase(),
        "Marca": product.brand || '-',
        isArchived: product.isArchived,
        isArchivedText: product.isArchived ? 'Archivado' : '-',

        "Fecha de creación": format(product.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Fecha de actualización": format(product.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Inventario',
            url: '/inventario'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <ProductClient data={formattedProducts} />
                </div>
            </div>
        </>
    );
}

export default ProductsPage;