import * as fs from 'fs';
import * as path from 'path';
import prismadb from '@/lib/prismadb';
import { NextRequest, NextResponse } from 'next/server';
import { SaleItem } from '@prisma/client';


// SALE ITEMS EXPORT
export async function GET(request: NextRequest) {
    try {
        // Read the range from query parameters.
        const { searchParams } = new URL(request.url)
        const range = searchParams.get('range')
        const exportType = searchParams.get('exportType')

        let data: SaleItem[] = []

        if (range === 'all') {
            // HISTORIC
            const date = new Date()
            date.setHours(0, 0, 0, 0)
            data = await prismadb.saleItem.findMany()
        } else if (range === 'last-seven') {
            // LAST SEVEN DAYS
            const date = new Date()
            date.setHours(0, 0, 0, 0)
            // Subtract 7 days
            date.setDate(date.getDate() - 7)
            // Fetch sales created or updated later than 7 days from current date
            data = await prismadb.saleItem.findMany({
                where: {
                    OR: [
                        { createdAt: { gte: date } },
                        { updatedAt: { gte: date } }
                    ]
                },
            })
        } else if (range === 'current-month') {
            // CURRENT MONTH
            const date = new Date()
            date.setHours(0, 0, 0, 0)
            // Calculate the start and end of the current month
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1); // First day of next month
            endOfMonth.setMilliseconds(-1); // End of the current month (inclusive).

            // Fetch sales created or updated later than startOfMonth and before endOfMonth
            data = await prismadb.saleItem.findMany({
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startOfMonth,
                                lt: endOfMonth,
                            }
                        },
                        {
                            updatedAt: {
                                gte: startOfMonth,
                                lt: endOfMonth,
                            }
                        }
                    ]
                },
            })
        } else if (range === 'current-quarter') {
            // CURRENT QUARTER
            // Determine the current quarter and calculate its start and end dates
            const date = new Date(); // Current date
            const currentMonth = date.getMonth();
            const currentQuarter = Math.floor(currentMonth / 3);

            const startOfQuarter = new Date(date.getFullYear(), currentQuarter * 3, 1);
            const endOfQuarter = new Date(date.getFullYear(), (currentQuarter + 1) * 3, 0);
            endOfQuarter.setMilliseconds(-1); // inclusive

            console.log(startOfQuarter, " / ", endOfQuarter)
            // Fetch sales within the last quarter
            data = await prismadb.saleItem.findMany({
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startOfQuarter,
                                lte: endOfQuarter,
                            }
                        },
                        {
                            updatedAt: {
                                gte: startOfQuarter,
                                lte: endOfQuarter,
                            }
                        }
                    ]
                },
            })
        } else if (range === 'current-year') {
            const date = new Date();
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999); // inclusive

            data = await prismadb.saleItem.findMany({
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startOfYear,
                                lte: endOfYear,
                            }
                        },
                        {
                            updatedAt: {
                                gte: startOfYear,
                                lte: endOfYear,
                            }
                        }
                    ]
                },
            })
        } else if (range === 'custom') {
            // Custom date range.
            // Dates are provided as DD-MM-YYYY. We use them to create new Date objects.
            const dateFrom = searchParams.get('dateFrom')
            const dateTo = searchParams.get('dateTo')

            if (!dateFrom || !dateTo) {
                return new NextResponse("Debe proporcionarse una fecha de inicio y una fecha de fin.", { status: 400 })
            }

            const startDate = new Date(dateFrom)
            const endDate = new Date(dateTo)
            endDate.setDate(endDate.getDate() + 1) // Add one day to the end date to include the whole day. So that it is inclusive and not exclusive

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return new NextResponse("Por favor, proporcione fechas válidas.", { status: 400 })
            }

            // Fetch sales within the custom date range
            data = await prismadb.saleItem.findMany({
                where: {
                    OR: [
                        {
                            createdAt: {
                                gte: startDate,
                                lte: endDate,
                            }
                        },
                        {
                            updatedAt: {
                                gte: startDate,
                                lte: endDate,
                            }
                        }
                    ]
                },
            })
        }

        if (data.length === 0) {
            return new NextResponse("No se encontraron nuevas ventas para el día de hoy.", { status: 200 })
        }

        if (exportType === 'json') {
            // Convert data to JSON
            const jsonData = JSON.stringify(data)
            // Write the JSON to a file
            const filePath = path.join(process.cwd(), 'public', 'ventas-items-hoy.json')
            fs.writeFileSync(filePath, jsonData)

            return NextResponse.json({ message: 'Ventas exportadas', filePath: `/ventas-items-hoy.json`, exportType: exportType }, { status: 200 })
        } else if (exportType === 'excel') {
            // EXCEL
            return NextResponse.json({ message: 'Ventas exportadas', data: data, exportType: exportType }, { status: 200 })
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error exportando los items de las ventas.' }, { status: 500 })
    }
}
