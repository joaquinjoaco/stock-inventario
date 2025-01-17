import * as fs from 'fs';
import * as path from 'path';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        // Subtract ten days
        todayStart.setDate(todayStart.getDate() - 8);

        // Fetch purchases created or updated today
        const data = await prismadb.purchase.findMany({
            where: {
                OR: [
                    { createdAt: { gte: todayStart } },
                    { updatedAt: { gte: todayStart } }
                ]
            }
        })

        if (data.length === 0) {
            return new NextResponse("No se encontraron nuevas compras para el día de hoy.", { status: 200 })
        }

        // Convert data to JSON
        const jsonData = JSON.stringify(data)

        // Write the JSON to a file
        const filePath = path.join(process.cwd(), 'public', 'compras-hoy.json')
        fs.writeFileSync(filePath, jsonData)

        return NextResponse.json({ message: 'Compras exportadas', filePath: `/compras-hoy.json` }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error exportando las compras.' }, { status: 500 })
    }
}
