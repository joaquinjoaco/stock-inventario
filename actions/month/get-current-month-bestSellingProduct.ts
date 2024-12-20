import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

export async function getCurrentMonthBestSellingProduct(): Promise<{ product: Product | null, quantitySold: number } | null> {
    try {
        const today = new Date();

        // Get the first and last days of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of the month, latest time possible 23:59:59:999

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
        });

        // Fetch product details
        if (bestSellingProducts.length > 0) {
            const bestProductId = bestSellingProducts[0].productId;

            const productDetails = await prismadb.product.findUnique({
                where: { id: bestProductId },
            });

            return {
                product: productDetails || null,
                quantitySold: Number(bestSellingProducts[0]._sum.quantity),
            };
        } else {
            return null; // No sales for the current month
        }
    } catch (error: any) {
        console.log(error);
        return null;
    }
}
