import prismadb from "@/lib/prismadb";

export async function getProductsOutOfStockCount(): Promise<number> {
    try {
        // Amount of products out of stock
        const productsOutOfStockQuery = await prismadb.product.count({
            where: {
                stock: {
                    lte: 0,
                },
            },
        })

        return Number(productsOutOfStockQuery)

    } catch (error: any) {
        console.log(error.stack)
        return 0
    }
}