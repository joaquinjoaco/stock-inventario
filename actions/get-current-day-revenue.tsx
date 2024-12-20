import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

// Returns the current day's revenue. 
export async function getCurrentDayReport(): Promise<string> {
    try {
        const today = new Date();

        // Dates seem to be properly handled by the ORM when using Prisma queries.
        // If we use Raw queries we need to handle the date conversion to UTC ourselves.
        // With Prisma queries it apparently does it automatically,
        // so we send a gmt-3 and it gets converted in the way to UTC to get compared.
        const queryResult = await prismadb.sale.aggregate({
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

        // Extract the result from the query.
        const totalRevenue = queryResult._sum.totalPrice || 0;

        // Format the result to UYU
        const formattedRevenue = formatterUYU.format(Number(totalRevenue));

        return formattedRevenue;

    } catch (error: any) {
        console.log(error);
        return "-";
    }
}