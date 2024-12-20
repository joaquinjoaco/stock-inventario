import prismadb from "@/lib/prismadb";
import { PurchaseForm } from "./components/purchase-form";
import { Product, Purchase } from "@prisma/client";
import { Header } from "@/components/ui/header";
import { serializeProducts, serializePurchase } from "@/lib/utils";

const PurchasePage = async (
    props: {
        params: Promise<{ purchaseId: string }>
    }
) => {
    const params = await props.params;

    const { purchaseId } = params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    // const id = purchaseId === 'nueva' ? -1 : params.purchaseId

    const purchase: Purchase & { product: Product } | null = purchaseId === 'nuevo' ?
        // null if we want to create a new purchase.
        null
        :
        // we search the purchase if a valid id was provided.
        await prismadb.purchase.findUnique({
            where: {
                id: purchaseId
            },
            include: {
                product: true
            }
        })

    // Get all non archived products.
    const products = await prismadb.product.findMany({
        where: {
            isArchived: false
        }
    })

    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedPurchase = serializePurchase(purchase)

    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedProducts = serializeProducts(products)

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Compras',
            url: '/compras'
        },
        {
            name: 'Cargar stock',
            url: '/compras/nueva'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <PurchaseForm initialData={serializedPurchase} serializedProducts={serializedProducts} />
                </div>
            </div>
        </>
    );
}

export default PurchasePage;