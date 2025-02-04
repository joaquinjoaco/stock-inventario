"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import FilterCombobox from "./filter-combobox";

interface ProductClientProps {
    data: ProductColumn[];
    productsStockAlertCount: number;
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data,
    productsStockAlertCount
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = searchParams.get('filter')

    const today = format(new Date(), "dd/MM/yy HH:mm", { locale: es })

    // Add state to store filtered data
    const [filteredData, setFilteredData] = useState<ProductColumn[]>(data)

    const generateSheet = () => {
        // Use the current filtered data state
        const sheetFromArrayOfObjects = (arrayOfObjects: ProductColumn[]) => {
            const formattedArray = arrayOfObjects.map((item) => ({
                "Nombre": item["Nombre"],
                "Precio de venta": item.sellingPrice,
                "Stock": Number(item["Stock"]),
                "Tipo": item["Tipo"],
                "Marca": item["Marca"],
                "Archivado": item.isArchivedText,
                "Fecha de creación": item.createdAt,
                "Fecha de actualización": item.updatedAt,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray)
            return worksheet
        };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(filteredData), 'Productos')
        XLSX.writeFile(workbook, `productos-${today}.xlsx`)
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 bg-background py-4 z-10">
                <Heading
                    title={`Productos (${filteredData.length})`}
                    description={productsStockAlertCount > 0 ?
                        <div className="flex items-center font-medium">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                            Hay productos con stock 1
                        </div> :
                        'Administra los productos del negocio'
                    }
                />
                <div className="flex gap-x-2">
                    <FilterCombobox currentFilter={filter} />
                    <Button onClick={() => { router.push('/inventario/nuevo') }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo producto
                    </Button>
                    <Button
                        disabled={filteredData.length === 0}
                        onClick={generateSheet}
                        className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground"
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable
                columns={columns}
                data={data}
                onDataFiltered={setFilteredData}
            />
        </>
    )
}