import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { es } from "date-fns/locale";
import { Header } from "@/components/ui/header";
import { getProductsStockAlert } from "@/actions/get-productsStockAlert";


export const metadata = {
    title: "Inventario",
}

const ProductsPage = async (props: {
    searchParams: Promise<{
        filter: 'OOS'
    }>
}) => {

    const searchParams = await props.searchParams // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const { filter } = searchParams
    let products
    if (filter === 'OOS') {
        products = await prismadb.product.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                stock: {
                    equals: 0
                }
            }
        })
    } else {
        products = await prismadb.product.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    const productsStockAlertCount = await getProductsStockAlert()

    const formattedProducts: ProductColumn[] = products.map((product) => ({
        "ID": product.id,
        "Nombre": product.name,
        "Precio de venta": formatterUYU.format(product.sellingPrice.toNumber()),
        sellingPrice: product.sellingPrice.toNumber(),
        "Stock": product.stock.toString(),
        "Tipo": product.unitType.toUpperCase(),
        "Marca": product.brand || '-',
        isArchived: product.isArchived,
        isArchivedText: product.isArchived ? 'Archivado' : '-',

        "Fecha de creación": format(product.createdAt, "dd MMMM, yyyy", { locale: es }),
        "Fecha de actualización": format(product.updatedAt, "dd MMMM, yyyy", { locale: es }),
        createdAt: format(product.createdAt, "dd/MM/yy HH:mm", { locale: es }),
        updatedAt: format(product.updatedAt, "dd/MM/yy HH:mm", { locale: es }),
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
                    <ProductClient data={formattedProducts} productsStockAlertCount={productsStockAlertCount} />
                </div>
            </div>
        </>
    );
}

export default ProductsPage;