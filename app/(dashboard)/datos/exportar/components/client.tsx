"use client"

import * as React from "react"
import * as XLSX from 'xlsx';
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
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { ListItemBig } from "@/components/ui/list-item-big";
import { Product, Purchase, PurchaseItem, Sale, SaleItem } from "@prisma/client"

export function ExportClient() {

    const [exportType, setExportType] = React.useState<"json" | "excel">("json") // json | excel
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
                response = await fetch(`/api/export/inventario?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}&exportType=${exportType}`)
            } else {
                response = await fetch(`/api/export/inventario?range=${range}&exportType=${exportType}`)
            }

            const res = await response.json()

            if (res.exportType === "json") {
                // JSON file download
                if (res.filePath) {
                    // Create a link element
                    const link = document.createElement('a')
                    link.href = res.filePath  // The URL to the file
                    link.download = `1_inventario-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                    // Programmatically click the link to trigger the download
                    document.body.appendChild(link) // Append the link to the body
                    link.click()  // Trigger the download
                    document.body.removeChild(link) // Clean up by removing the link element
                } else {
                    console.log(res.message)
                }
            } else {
                // EXCEL
                if (res.data) {
                    const sheetFromArrayOfObjects = (arrayOfObjects: Product[]) => {
                        const formattedArray = arrayOfObjects.map((item) => ({
                            "Nombre": item.name,
                            "Precio de venta": Number(item.sellingPrice),
                            "Stock": item.stock,
                            "Tipo": item.unitType,
                            "Marca": item.brand ? item.brand : "-",
                            "Archivado": item.isArchived ? "Archivado" : "-",
                            "Fecha de creación": format(item.createdAt, "dd-MM-yy HH:mm", { locale: es }),
                            "Fecha de actualización": format(item.updatedAt, "dd-MM-yy HH:mm", { locale: es }),
                        }));
                        const worksheet = XLSX.utils.json_to_sheet(formattedArray)
                        return worksheet
                    };

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(res.data), 'Productos')
                    XLSX.writeFile(workbook, `inventario-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.xlsx`)

                } else {
                    console.log(res.message)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportPurchases = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/compras?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}&exportType=${exportType}`)
            } else {
                response = await fetch(`/api/export/compras?range=${range}&exportType=${exportType}`)
            }

            const res = await response.json()

            if (res.exportType === "json") {
                // JSON file download
                if (res.filePath) {
                    // Create a link element
                    const link = document.createElement('a')
                    link.href = res.filePath  // The URL to the file
                    link.download = `2_compras-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                    // Programmatically click the link to trigger the download
                    document.body.appendChild(link) // Append the link to the body
                    link.click()  // Trigger the download
                    document.body.removeChild(link) // Clean up by removing the link element
                } else {
                    console.log(res.message)
                }
            } else {
                // EXCEL
                if (res.data) {
                    const sheetFromArrayOfObjects = (arrayOfObjects: Purchase[]) => {
                        const formattedArray = arrayOfObjects.map((item) => ({
                            "ID": item.id,
                            "Costo total": item.totalCost,
                            "Proveedor": item.supplier,
                            "Fecha de creación": format(item.createdAt, "dd-MM-yy HH:mm", { locale: es }),
                        }));
                        const worksheet = XLSX.utils.json_to_sheet(formattedArray)
                        return worksheet
                    };

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(res.data), 'Compras')
                    XLSX.writeFile(workbook, `compras-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.xlsx`)

                } else {
                    console.log(res.message)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportPurchaseItems = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/compras/purchaseItems?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}&exportType=${exportType}`)
            } else {
                response = await fetch(`/api/export/compras/purchaseItems?range=${range}&exportType=${exportType}`)
            }

            const res = await response.json()

            if (res.exportType === "json") {
                // JSON file download
                if (res.filePath) {
                    // Create a link element
                    const link = document.createElement('a')
                    link.href = res.filePath  // The URL to the file
                    link.download = `3_compras_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                    // Programmatically click the link to trigger the download
                    document.body.appendChild(link) // Append the link to the body
                    link.click()  // Trigger the download
                    document.body.removeChild(link) // Clean up by removing the link element
                } else {
                    console.log(res.message)
                }
            } else {
                // EXCEL
                if (res.data) {
                    const sheetFromArrayOfObjects = (arrayOfObjects: PurchaseItem[]) => {
                        const formattedArray = arrayOfObjects.map((item) => ({
                            "ID de compra": item.purchaseId,
                            "Costo unitario": item.cost,
                            "Cantidad": item.quantity,
                            "Fecha de creación": format(item.createdAt, "dd-MM-yy HH:mm", { locale: es }),
                        }));
                        const worksheet = XLSX.utils.json_to_sheet(formattedArray)
                        return worksheet
                    };

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(res.data), 'Items de compras')
                    XLSX.writeFile(workbook, `compras_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.xlsx`)

                } else {
                    console.log(res.message)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportSales = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/ventas?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}&exportType=${exportType}`)
            } else {
                response = await fetch(`/api/export/ventas?range=${range}&exportType=${exportType}`)
            }

            const res = await response.json()

            if (res.exportType === "json") {
                // JSON file download
                if (res.filePath) {
                    // Create a link element
                    const link = document.createElement('a')
                    link.href = res.filePath  // The URL to the file
                    link.download = `4_ventas-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                    // Programmatically click the link to trigger the download
                    document.body.appendChild(link) // Append the link to the body
                    link.click()  // Trigger the download
                    document.body.removeChild(link) // Clean up by removing the link element
                } else {
                    console.log(res.message)
                }
            } else {
                // EXCEL
                if (res.data) {
                    const sheetFromArrayOfObjects = (arrayOfObjects: Sale[]) => {
                        const formattedArray = arrayOfObjects.map((item) => ({
                            "ID": item.id,
                            "Total": item.totalPrice,
                            "Método de pago": item.paymentType,
                            "Descuentos otorgados": item.discount,
                            "Fecha de creación": format(item.createdAt, "dd-MM-yy HH:mm", { locale: es }),
                        }));
                        const worksheet = XLSX.utils.json_to_sheet(formattedArray)
                        return worksheet
                    };

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(res.data), 'Ventas')
                    XLSX.writeFile(workbook, `ventas-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.xlsx`)

                } else {
                    console.log(res.message)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const exportSaleItems = async () => {
        try {
            let response
            if (range === 'custom') {
                response = await fetch(`/api/export/ventas/saleItems?range=${range}&dateFrom=${dateFrom}&dateTo=${dateTo}&exportType=${exportType}`)
            } else {
                response = await fetch(`/api/export/ventas/saleItems?range=${range}&exportType=${exportType}`)
            }

            const res = await response.json()
            if (res.exportType === "json") {
                // JSON file download
                if (res.filePath) {
                    // Create a link element
                    const link = document.createElement('a')
                    link.href = res.filePath  // The URL to the file
                    link.download = `5_ventas_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                    // Programmatically click the link to trigger the download
                    document.body.appendChild(link) // Append the link to the body
                    link.click()  // Trigger the download
                    document.body.removeChild(link) // Clean up by removing the link element
                } else {
                    console.log(res.message)
                }
            } else {
                // EXCEL
                if (res.data) {
                    const sheetFromArrayOfObjects = (arrayOfObjects: SaleItem[]) => {
                        const formattedArray = arrayOfObjects.map((item) => ({
                            "ID de la venta": item.saleId,
                            "Precio calculado": item.calculatedPrice,
                            "Cantidad": item.quantity,
                            "Fecha de creación": format(item.createdAt, "dd-MM-yy HH:mm", { locale: es }),
                        }));
                        const worksheet = XLSX.utils.json_to_sheet(formattedArray)
                        return worksheet
                    };

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(res.data), 'Ventas')
                    XLSX.writeFile(workbook, `ventas_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.xlsx`)

                } else {
                    console.log(res.message)
                }
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

            const res = await response.json()

            if (res.filePath) {
                // Create a link element
                const link = document.createElement('a')
                link.href = res.filePath  // The URL to the file
                link.download = `6_negocio-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

                // Programmatically click the link to trigger the download
                document.body.appendChild(link) // Append the link to the body
                link.click()  // Trigger the download
                document.body.removeChild(link) // Clean up by removing the link element
            } else {
                console.log(res.message)
            }
        } catch (error) {
            console.log(error)
        }
    }


    // Called when export button is clicked.
    const exportData = async () => {
        setIsExporting(true)
        try {
            await exportInventory()
            await exportPurchases()
            await exportPurchaseItems()
            await exportSales()
            await exportSaleItems()
            if (exportType === 'json') {
                await exportBusinessInfo()
            }
        } catch (error) {
            console.error(error)
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
                    <CardDescription>
                        Configura y exporta tus datos en formato
                        <TooltipWrapper
                            content={
                                <ListItemBig
                                    href="https://www.w3schools.com/js/js_json_intro.asp"
                                    icon={<FileJson />}
                                    title="JSON"
                                    blank
                                >
                                    Formato de archivo de texto estructurado que se utiliza para el intercambio de datos.
                                </ListItemBig>
                            }>
                            <b> .JSON </b>
                        </TooltipWrapper>
                        para cargarlos en otra instancia de la aplicación.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="export-type">Formato</Label>
                        <Select value={exportType} onValueChange={(e) => { setExportType(e as "json" | "excel") }}>
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
