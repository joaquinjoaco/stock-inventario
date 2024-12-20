import prismadb from "@/lib/prismadb";

export async function getCurrentMonthSalesCount(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        // Count sales for the current month
        const salesCountQuery = await prismadb.sale.count({
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        return Number(salesCountQuery);

    } catch (error: any) {
        console.log(error);
        return 0;
    }
}
