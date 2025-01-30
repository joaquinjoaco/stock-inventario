import prismadb from "@/lib/prismadb";

export async function getCurrentDayDiscounts(): Promise<number> {
    try {
        const today = new Date();
        // Dates seem to be properly handled by the ORM when using Prisma queries.
        // If we use Raw queries we need to handle the date conversion to UTC ourselves.
        // With Prisma queries it apparently does it automatically,
        // so we send a gmt-3 and it gets converted in the way to UTC to get compared.

        // Total of discounts for the current day.
        const discountsTotalQuery = await prismadb.sale.aggregate({
            _sum: {
                discount: true,
            },
            where: {
                // for sales its ok to use createdAt and not updatedAt.
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),  // Local start of day
                    // below line is not needed, since we are creating a new date from today's date.
                    lt: new Date(today.setHours(23, 59, 59, 999)), // Local end of day
                },
            },
        });

        return Number(discountsTotalQuery._sum.discount || 0);

    } catch (error: any) {
        console.log(error.stack);
        return 0;
    }
}