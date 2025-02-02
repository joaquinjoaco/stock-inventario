"use client"

import * as React from "react"
import { CalendarIcon, Download, FileJson, FileSpreadsheet, Loader2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export function ExportClient() {

    const [exportType, setExportType] = React.useState("json")
    const [range, setRange] = React.useState("all") // "all" | "last-seven" | "current-month" | "current-quarter" | "current-year" | "custom"
    const [dateFrom, setDateFrom] = React.useState<Date>()
    const [dateTo, setDateTo] = React.useState<Date>()
    const [isExporting, setIsExporting] = React.useState(false)

    const { toast } = useToast()

    const date = new Date(); // Current date
    const currentMonth = date.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);
    const startOfQuarter = new Date(date.getFullYear(), currentQuarter * 3, 1);
    const endOfQuarter = new Date(date.getFullYear(), (currentQuarter + 1) * 3, 0);

    const exportInventory = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/inventario?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/inventario?range=${range}`)
            }
            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `1_inventario-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportPurchases = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/compras?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/compras?range=${range}`)
            }
            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `2_compras-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportPurchaseItems = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/compras/purchaseItems?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/compras/purchaseItems?range=${range}`)
            }

            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `3_compras_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportSales = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/ventas?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/ventas?range=${range}`)
            }

            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `4_ventas-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportSaleItems = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/ventas/saleItems?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/ventas/saleItems?range=${range}`)
            }
            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `5_ventas_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportBusinessInfo = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/negocio?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
            } else {
                response = await fetch(`/api/export/negocio?range=${range}`)
            }

            const data = await response.json()

            if (data.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = data.filePath  // The URL to the file
                link.download = `6_negocio-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportData = async () => {
        setIsExporting(true)
        try {
            await exportInventory()
            await exportPurchases()
            await exportPurchaseItems()
            await exportSales()
            await exportSaleItems()
            await exportBusinessInfo()
        } catch (error) {
            console.log(error)
            toast({
                title: `Ocurrió un error inesperado`,
                description: `Ocurrió un error inesperado al exportar los datos.`,
                variant: "destructive",
            })
            setIsExporting(false)
        }
        setIsExporting(false)
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Exportar datos</CardTitle>
                    <CardDescription>Configura y exporta tus datos en formato .JSON para cargarlos en otra instancia de la aplicación. O puedes exportarlos en una planilla (.xlsx)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="export-type">Formato</Label>
                        <Select value={exportType} onValueChange={setExportType}>
                            <SelectTrigger id="export-type">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json" className="cursor-pointer">
                                    <div className="flex items-center">
                                        <FileJson className="mr-2 h-4 w-4" />
                                        JSON (.json)
                                    </div>
                                </SelectItem>
                                <SelectItem value="excel" className="cursor-pointer">
                                    <div className="flex items-center">
                                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                                        Excel (.xlsx)
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date-range">Rango de fechas</Label>
                        <Select value={range} onValueChange={setRange}>
                            <SelectTrigger id="date-range">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="cursor-pointer">Todos los datos</SelectItem>
                                <SelectItem value="last-seven" className="cursor-pointer">Últimos 7 días</SelectItem>
                                <SelectItem value="current-month" className="cursor-pointer">Este mes ({format(date, 'MMMM', { locale: es })})</SelectItem>
                                <SelectItem value="current-quarter" className="cursor-pointer">Este trimestre ({format(startOfQuarter, 'MMMM', { locale: es })} - {format(endOfQuarter, 'MMMM', { locale: es })})</SelectItem>
                                <SelectItem value="current-year" className="cursor-pointer">Este año ({format(date, 'yyyy', { locale: es })})</SelectItem>
                                <SelectItem value="custom" className="cursor-pointer">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {range === "custom" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date-from">Fecha de inicio</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateFrom ? format(dateFrom, "P", { locale: es }) : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            locale={es}
                                            mode="single"
                                            selected={dateFrom}
                                            onSelect={setDateFrom}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date-to">Fecha de fin</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateTo ? format(dateTo, "P", { locale: es }) : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            locale={es}
                                            mode="single"
                                            selected={dateTo}
                                            onSelect={setDateTo}
                                            fromDate={dateFrom}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={exportData}
                        disabled={isExporting}
                        className="w-full"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exportando...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Exportar datos
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
