import prismadb from "@/lib/prismadb";
import { PaymentType } from "@prisma/client";

export async function getCurrentMonthSalesCount(paymentType: PaymentType | 'ALL'): Promise<number> {
    try {
        const today = new Date();

        // Calculate the start and end of the current month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of next month
        endOfMonth.setMilliseconds(-1); // End of the current month

        let salesCountQuery
        if (paymentType === 'ALL') {
            // Count all sales for the current month
            salesCountQuery = await prismadb.sale.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                        lt: endOfMonth,
                    },
                },
            });
        } else {
            // Count sales for the current month with a specific payment type
            salesCountQuery = await prismadb.sale.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                        lt: endOfMonth,
                    },
                    paymentType: paymentType
                },
            });
        }
        return Number(salesCountQuery);

    } catch (error: any) {
        console.log(error.stack);
        return 0;
    }
}
