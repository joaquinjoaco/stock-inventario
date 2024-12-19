"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PurchaseColumn, columns } from "./columns";
import { ProductsDataTable } from "@/components/ui/products-data-table";

interface PurchaseClientProps {
    data: PurchaseColumn[];
}

export const PurchaseClient: React.FC<PurchaseClientProps> = ({
    data
}) => {

    const router = useRouter();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: PurchaseColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "ID": item["ID"],
                "Nombre del producto": item["Nombre del producto"],
                "Cantidad": item["Cantidad"],
                "Costo total": item["Costo total"],
                "Tipo": item["Tipo"],
                "Proveedor": item["Proveedor"],
                "Fecha de creación": item["Fecha de creación"],
                "Fecha de actualización": item["Fecha de actualización"],
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Compras');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'compras.xlsx');
    }

    return (
        <>
            <div className="flex items-center justify-between sticky top-0 bg-background py-4">
                <Heading
                    title={`Compras (${data.length})`}
                    description="Administra las compras del negocio"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/compras/nueva`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva compra
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <ProductsDataTable columns={columns} data={data} />
        </>
    )
}