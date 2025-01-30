import prismadb from "@/lib/prismadb";

export async function getCurrentMonthSalesTotal(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        // very close to the approach of asking for day 0 of a month. Instead, here we get first day of the next month but at 00:00:00, essentially the same...
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of the next month

        endOfMonth.setMilliseconds(-1); // End of the current month

        // Total of sales for the current month
        const salesTotalQuery = await prismadb.sale.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        return Number(salesTotalQuery._sum.totalPrice || 0);

    } catch (error: any) {
        console.log(error.stack);
        return 0;
    }
}
