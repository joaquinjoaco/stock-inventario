"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { SalesColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import FilterCombobox from "./filter-combobox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatterUYU } from "@/lib/utils";

interface SalesClientProps {
    data: SalesColumn[];
}

interface SaleRow {
    "Total": string | number;
    "Método de pago": string | number;
    "Descuentos otorgados": string | number;
    "Fecha de creación": string | number;
}
export const SalesClient: React.FC<SalesClientProps> = ({
    data
}) => {

    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = searchParams.get('filter')
    const monthFilter = searchParams.get('month')

    const today = format(new Date(), "dd/MM/yy HH:mm", { locale: es })

    // Add state to store filtered data
    const [filteredData, setFilteredData] = useState<SalesColumn[]>(data)

    // Calculate the total sum of the sales from filtered Data using useMemo
    const salesTotal = useMemo(() => {
        return filteredData.reduce((acc, sale) => {
            return acc + sale.totalPrice;
        }, 0);
    }, [filteredData]);

    const discountsTotal = useMemo(() => {
        return filteredData.reduce((acc, sale) => {
            return acc + sale.discount
        }, 0)
    }, [filteredData]);

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: SalesColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray: SaleRow[] = arrayOfObjects.map((item) => ({
                "Total": item.totalPrice,
                "Método de pago": item["Método de pago"],
                "Descuentos otorgados": item.discount,
                "Fecha de creación": item.createdAt,
            }));

            // Add totals row
            formattedArray.push(
                {
                    "Total": "TOTALES",
                    "Método de pago": salesTotal,
                    "Descuentos otorgados": "DESCUENTOS OTORGADOS",
                    "Fecha de creación": discountsTotal,
                }
            )
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);

            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(filteredData), 'Ventas');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, `ventas-${today}.xlsx`);
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 bg-background py-4 z-10">
                <Heading
                    title={`Ventas (${filteredData.length})`}
                    description={
                        <Badge variant="default" className="mt-2 text-md">
                            Totales: {formatterUYU.format(salesTotal)}
                        </Badge>
                    }
                />
                <div className="flex gap-x-2">
                    <FilterCombobox
                        currentFilter={filter as 'MONTHLY' | 'WEEKLY' | 'DAILY'}
                        currentMonthFilter={monthFilter}
                    />
                    <Button onClick={() => { router.push(`/ventas/nueva`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva venta
                    </Button>
                    <Button disabled={filteredData.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
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