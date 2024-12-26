import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

export async function getGivenMonthBestSellingProduct(month: number, year: number): Promise<{ product: Product | null, quantitySold: number } | null> {
    try {

        if (month < 0 || month > 11) {
            console.error('Mes inválido, debe ser un número entre 0 y 11')
            return null
        }

        // Get the first and last days of the month
        const startOfMonth = new Date(year, month, 1) // First day of the month
        // Asking for day 0 of a month actually gives you the last day of the previous month, so we add 1 to the month.
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999) // Last day of the month, latest time possible 23:59:59:999

        const bestSellingProducts = await prismadb.saleItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
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
            take: 1, // Only fetch the best-selling product
        })

        // Fetch product details
        if (bestSellingProducts.length > 0) {
            const bestProductId = bestSellingProducts[0].productId

            const productDetails = await prismadb.product.findUnique({
                where: { id: bestProductId },
            })

            return {
                product: productDetails || null,
                quantitySold: Number(bestSellingProducts[0]._sum.quantity),
            }
        } else {
            return null // No sales for the current month
        }
    } catch (error: any) {
        console.log(error)
        return null
    }
}
