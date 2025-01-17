import prismadb from "@/lib/prismadb";

export async function getCurrentMonthDiscounts(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        // very close to the approach of asking for day 0 of a month. Instead, here we get first day of the next month but at 00:00:00, essentially the same...
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of the next month

        endOfMonth.setMilliseconds(-1); // End of the current month

        // Total of discounts for the current month
        const discountsTotalQuery = await prismadb.sale.aggregate({
            _sum: {
                discount: true,
            },
            where: {
                createdAt: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
            },
        });

        return Number(discountsTotalQuery._sum.discount || 0);

    } catch (error: any) {
        console.log(error);
        return 0;
    }
}
