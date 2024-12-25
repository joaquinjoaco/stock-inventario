import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

export async function getGivenMonthTop10BestSellingProducts(month: number, year: number): Promise<{ product: Product | null; quantitySold: number }[]> {
    try {
        if (month < 0 || month > 11) {
            // 0-based index
            console.error('Mes inválido, debe ser un número entre 0 y 11')
            return []
        }
        // Get the first and last days of the month
        const startOfMonth = new Date(year, month, 1) // First day of the month
        // Asking for day 0 of a month actually gives you the last day of the previous month, so we add 1 to the month.
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999) // Last day of the month, latest time possible 23:59:59:999

        // Get the sales data grouped by product
        const bestSellingProducts = await prismadb.saleItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true, // sum the quantities sold
            },
            where: {
                createdAt: {
                    gte: startOfMonth, // Start of the current month
                    lt: endOfMonth,    // End of the current month
                },
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 10,
        })

        // If there are sales, fetch the corresponding products
        if (bestSellingProducts.length > 0) {
            // Fetch all products in parallel
            const productsWithQuantities = await Promise.all(
                bestSellingProducts.map(async (bestProduct) => {
                    const product = await prismadb.product.findUnique({
                        where: { id: bestProduct.productId },
                    })

                    return {
                        product,
                        // Use the quantity from the corresponding sale item
                        quantitySold: Number(bestProduct._sum.quantity || 0),
                    }
                })
            )

            return productsWithQuantities
        }

        // Return empty array if no sales
        return []
    } catch (error) {
        console.error('Error fetching historic best selling products:', error)
        return []
    }
}