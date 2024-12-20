import prismadb from "@/lib/prismadb";

export async function getCurrentDaySalesTotal(): Promise<number> {
    try {
        const today = new Date();
        // Dates seem to be properly handled by the ORM when using Prisma queries.
        // If we use Raw queries we need to handle the date conversion to UTC ourselves.
        // With Prisma queries it apparently does it automatically,
        // so we send a gmt-3 and it gets converted in the way to UTC to get compared.

        // Total of sales for the current day.
        const salesTotalQuery = await prismadb.sale.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: {
                // for sales its ok to use createdAt and not updatedAt.
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),  // Local start of day
                    lt: new Date(today.setHours(23, 59, 59, 999)), // Local end of day
                },
            },
        });

        return Number(salesTotalQuery._sum.totalPrice || 0);

    } catch (error: any) {
        console.log(error);
        return 0;
    }
}