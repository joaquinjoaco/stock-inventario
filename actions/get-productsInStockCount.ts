import prismadb from "@/lib/prismadb";

export async function getProductsInStockCount(): Promise<number> {
    try {
        // Amount of products in stock
        const productsInStockQuery = await prismadb.product.count({
            where: {
                stock: {
                    gt: 0,
                },
            },
        })

        return Number(productsInStockQuery)

    } catch (error: any) {
        console.log(error)
        return 0
    }
}