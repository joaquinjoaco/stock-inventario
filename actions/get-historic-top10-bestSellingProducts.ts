import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

export async function getHistoricTop10BestSellingProducts(): Promise<{ product: Product | null; quantitySold: number }[]> {
    try {

        // Get the sales data grouped by product
        const bestSellingProducts = await prismadb.saleItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true, // sum the quantities sold
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