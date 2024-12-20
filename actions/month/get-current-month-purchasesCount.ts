import prismadb from "@/lib/prismadb";

export async function getCurrentMonthPurchasesCount(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        // Count the number of purchases for the current month
        const purchasesCountQuery = await prismadb.purchase.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        return Number(purchasesCountQuery);

    } catch (error: any) {
        console.log(error);
        return 0;
    }
}
