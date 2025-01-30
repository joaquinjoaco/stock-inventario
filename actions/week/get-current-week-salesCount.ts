import prismadb from "@/lib/prismadb";

export async function getCurrentWeekSalesCount(): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current week
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
        startOfWeek.setHours(0, 0, 0, 0); // Start of day

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to next Sunday
        endOfWeek.setMilliseconds(-1); // End of the current week

        // Count sales for the current week
        const salesCountQuery = await prismadb.sale.count({
            where: {
                createdAt: {
                    gte: startOfWeek,
                    lt: endOfWeek,
                },
            },
        });

        return Number(salesCountQuery);

    } catch (error: any) {
        console.log(error.stack);
        return 0;
    }
}
