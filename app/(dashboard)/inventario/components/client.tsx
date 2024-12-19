"use client";

import { useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ProductColumn, columns } from "./columns";
import { ProductsDataTable } from "@/components/ui/products-data-table";

interface ProductClientProps {
    data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: ProductColumn[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                "ID": item["ID"],
                "Nombre": item["Nombre"],
                "Precio de venta": item["Precio de venta"],
                "Stock": item["Stock"],
                "Tipo": item["Tipo"],
                "Marca": item["Marca"],
                "Archivado": item.isArchivedText,

                "Fecha de creación": item["Fecha de creación"],
                "Fecha de actualización": item["Fecha de actualización"],
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Productos');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'productos.xlsx');
    }


    const generateSheet2 = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: ProductColumn[]) => {

            const worksheet = XLSX.utils.json_to_sheet(arrayOfObjects);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Productos');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'productos.xlsx');
    }


    return (
        <>
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background py-4">
                <Heading
                    title={`Productos (${data.length})`}
                    description="Administra los productos del negocio"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/inventario/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo producto
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                    <Button disabled={data.length === 0} onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo 2
                    </Button>
                </div>
            </div>
            <Separator />
            <ProductsDataTable columns={columns} data={data} />
        </>
    )
}