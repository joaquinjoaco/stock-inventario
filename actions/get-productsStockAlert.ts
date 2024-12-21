import prismadb from "@/lib/prismadb";

export async function getProductsStockAlert(): Promise<number> {
    try {
        // Amount of products whose stock is 1
        const productsOutOfStockQuery = await prismadb.product.count({
            where: {
                stock: {
                    equals: 1,
                },
            },
        })

        return Number(productsOutOfStockQuery)

    } catch (error: any) {
        console.log(error)
        return 0
    }
}