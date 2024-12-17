import prismadb from "@/lib/prismadb";
import { SaleForm } from "./components/sales-form";
import { Product, Sale, SaleItem } from "@prisma/client";
import { Header } from "@/components/ui/header";
import { serializeProducts, serializeSale } from "@/lib/utils";

const SalesPage = async (
    props: {
        params: Promise<{ saleId: string }>
    }
) => {
    const params = await props.params;

    const { saleId } = params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const id = saleId === 'nueva' ? -1 : params.saleId

    const sale: Sale & { saleItems: (SaleItem & { product: Product })[] } | null =
        saleId === 'nuevo' ?
            // null if we want to create a new sale.
            null
            :
            // we search the sale if a valid id was provided.
            await prismadb.sale.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    saleItems: {
                        include: {
                            product: true,
                        }
                    }
                }
            })
    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedSale = serializeSale(sale)

    // Get all non archived products.
    const products = await prismadb.product.findMany({
        where: {
            isArchived: false
        }
    })
    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedProducts = serializeProducts(products)

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Ventas',
            url: '/ventas'
        },
        {
            name: 'Registrar venta',
            url: '/compras/nueva'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SaleForm initialData={serializedSale} serializedProducts={serializedProducts} />
                </div>
            </div>
        </>
    );
}

export default SalesPage;