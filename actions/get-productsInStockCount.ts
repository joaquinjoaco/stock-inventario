import prismadb from "@/lib/prismadb";

export async function getProductsInStockCount(): Promise<number> {
    try {
        const today = new Date()
        // Dates seem to be properly handled by the ORM when using Prisma queries.
        // If we use Raw queries we need to handle the date conversion to UTC ourselves.
        // With Prisma queries it apparently does it automatically,
        // so we send a gmt-3 and it gets converted in the way to UTC to get compared.

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