"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
    data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // const onDelete = async () => {
    //     try {
    //         setLoading(true);
    //         await axios.delete(`/api/${params.storeId}/productos/${data.id}`);
    //         router.refresh(); // Refresh the component so it refetches the data.
    //         toast.success("Producto eliminado.");
    //         router.refresh();
    //     } catch (error: any) {
    //         if (error.response.status === 409) {
    //             if (error.response.data === "fk-constraint-failed") {
    //                 toast.error("No se puede eliminar el producto. Aparece en pedidos registrados.");
    //             } else {
    //                 toast.error("Ocurrió un error inesperado.");
    //             }
    //         }
    //     } finally {
    //         setLoading(false);
    //         setOpen(false);
    //     }
    // }

    return (
        <>
            {/* <AlertModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onConfirm={onDelete}
                    loading={loading}
                    title="¿Borrar producto?"
                    description="Se borrará el producto, esta acción no se puede deshacer."
                    buttonMessage="Confirmar"
                /> */}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        {/* accesibility fature, screenreaders only 'open menu' */}
                        <span className="sr-only">Abrir menú de acciones</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/inventario/${data["ID"]}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>

        </>
    );
};