import prismadb from "@/lib/prismadb";

export async function getCurrentDayPurchasesTotal(): Promise<number> {
    try {
        const today = new Date()
        // Dates seem to be properly handled by the ORM when using Prisma queries.
        // If we use Raw queries we need to handle the date conversion to UTC ourselves.
        // With Prisma queries it apparently does it automatically,
        // so we send a gmt-3 and it gets converted in the way to UTC to get compared.

        // Total of purchases for the current day
        const purchasesTotalQuery = await prismadb.purchase.aggregate({
            _sum: {
                totalCost: true,
            },
            where: {
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),  // Local start of day
                    lt: new Date(today.setHours(23, 59, 59, 999)), // Local end of day
                },
            }
        })

        return Number(purchasesTotalQuery._sum.totalCost || 0)

    } catch (error: any) {
        console.log(error.stack)
        return 0
    }
}