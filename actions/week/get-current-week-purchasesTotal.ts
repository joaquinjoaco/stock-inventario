import prismadb from "@/lib/prismadb";

export async function getCurrentWeekPurchasesTotal(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Start of day

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday
        endOfWeek.setMilliseconds(-1); // End of the current week

        // Total of purchases for the current week
        const purchasesTotalQuery = await prismadb.purchase.aggregate({
            _sum: {
                totalCost: true,
            },
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lt: endOfWeek,
                },
            },
        });

        return Number(purchasesTotalQuery._sum.totalCost || 0);

    } catch (error: any) {
        console.log(error);
        return 0;
    }
}
