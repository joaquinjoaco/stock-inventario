/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        // Subtract two days
        todayStart.setDate(todayStart.getDate() - 2);

        // Fetch business information created or updated today
        const data = await prismadb.business.findFirst()

        if (!data) {
            return new NextResponse("No se encontró nueva información del negocio para el día de hoy.", { status: 200 })
        }

        // Convert data to JSON
        const jsonData = JSON.stringify(data)

        // Write the JSON to a file
        const filePath = path.join(process.cwd(), 'public', 'negocio-hoy.json')
        fs.writeFileSync(filePath, jsonData)

        return NextResponse.json({ message: 'Información del negocio exportada', filePath: `/negocio-hoy.json` }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Ocurrió un error exportando la información del negocio.' }, { status: 500 })
    }
}
