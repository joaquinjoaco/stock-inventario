import prismadb from "@/lib/prismadb";

export async function getCurrentMonthPurchasesTotal(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        // Total of purchases for the current month
        const purchasesTotalQuery = await prismadb.purchase.aggregate({
            _sum: {
                totalCost: true,
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        return Number(purchasesTotalQuery._sum.totalCost || 0);

    } catch (error: any) {
        console.log(error.stack);
        return 0;
    }
}
