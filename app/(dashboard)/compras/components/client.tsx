"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PurchaseColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import FilterCombobox from "./filter-combobox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatterUYU } from "@/lib/utils";

interface PurchaseClientProps {
    data: PurchaseColumn[];
}

export const PurchaseClient: React.FC<PurchaseClientProps> = ({
    data
}) => {

    const router = useRouter();
    const searchParams = useSearchParams()
    const filter = searchParams.get('filter')
    const monthFilter = searchParams.get('month')

    const today = format(new Date(), "dd/MM/yy HH:mm", { locale: es })

    // Add state to store filtered data
    const [filteredData, setFilteredData] = useState<PurchaseColumn[]>(data)

    // Calculate the total sum of the purchases from filtered Data using useMemo
    const purchasesTotal = useMemo(() => {
        return filteredData.reduce((acc, purchase) => {
            return acc + purchase.totalCost
        }, 0);
    }, [filteredData]);

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: PurchaseColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "Productos": item["Productos"],
                "Costo total": item.totalCost, // Not formatted so the user can perform calculations on the sheet
                "Proveedor": item["Proveedor"],
                "Fecha de creación": item.createdAt,
            }));

            // Add total row
            formattedArray.push(
                {
                    "Productos": "TOTALES",
                    "Costo total": purchasesTotal,
                    "Proveedor": "",
                    "Fecha de creación": "",
                }
            )

            const worksheet = XLSX.utils.json_to_sheet(formattedArray);

            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(filteredData), 'Compras');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, `compras-${today}.xlsx`);
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 bg-background py-4 z-10">
                <Heading
                    title={`Compras (${filteredData.length})`}
                    description={
                        <Badge variant="default" className="mt-2 text-md">
                            Totales: {formatterUYU.format(purchasesTotal)}
                        </Badge>
                    }
                />
                <div className="flex gap-x-2">
                    <FilterCombobox
                        currentFilter={filter as 'MONTHLY' | 'WEEKLY' | 'DAILY'}
                        currentMonthFilter={monthFilter}
                    />
                    <Button onClick={() => { router.push(`/compras/nueva`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva compra
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