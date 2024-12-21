import * as fs from 'fs';
import * as path from 'path';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';


// SALES EXPORT
export async function GET() {
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        // Subtract one day
        todayStart.setDate(todayStart.getDate() - 1);

        // Fetch sales created or updated today
        const data = await prismadb.sale.findMany({
            where: {
                OR: [
                    { createdAt: { gte: todayStart } },
                    { updatedAt: { gte: todayStart } }
                ]
            },
        })

        if (data.length === 0) {
            return new NextResponse("No se encontraron nuevas ventas para el día de hoy.", { status: 200 })
        }

        // Convert data to JSON
        const jsonData = JSON.stringify(data)

        // Write the JSON to a file
        const filePath = path.join(process.cwd(), 'public', 'ventas-hoy.json')
        fs.writeFileSync(filePath, jsonData)

        return NextResponse.json({ message: 'Ventas exportadas', filePath: `/ventas-hoy.json` }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error exportando las ventas.' }, { status: 500 })
    }
}
