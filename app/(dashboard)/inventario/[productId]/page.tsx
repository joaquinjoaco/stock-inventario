import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";
import { Product } from "@prisma/client";
import { Header } from "@/components/ui/header";
import { serializeProduct } from "@/lib/utils";

const ProductPage = async (
    props: {
        params: Promise<{ productId: string }>
    }
) => {
    const params = await props.params;

    const { productId } = params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const id = productId === 'nuevo' ? -1 : params.productId

    const product: Product | null = productId === 'nuevo' ?
        // null if we want to create a new product.
        null
        :
        // we search the product if a valid id was provided.
        await prismadb.product.findUnique({
            where: {
                id: Number(id)
            }
        })

    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedProduct = serializeProduct(product)

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Inventario',
            url: '/inventario'
        },
        {
            name: 'Registrar producto',
            url: '/inventario/nuevo'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ProductForm initialData={serializedProduct} />
                </div>
            </div>
        </>
    );
}

export default ProductPage;