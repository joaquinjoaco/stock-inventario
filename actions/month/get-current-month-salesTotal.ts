import prismadb from "@/lib/prismadb";

export async function getCurrentMonthSalesTotal(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
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
        console.log(error);
        return 0;
    }
}
