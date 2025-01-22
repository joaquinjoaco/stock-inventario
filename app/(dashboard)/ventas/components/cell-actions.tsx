/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Check, Eye, MoreHorizontal, Printer, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SalesColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface CellActionProps {
    data: SalesColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const router = useRouter();

    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/ventas/${data["ID"]}`);
            router.refresh(); // Refresh the component so it refetches the data.
            toast({
                title: <div className="flex items-center text-green-500">
                    <Check className="h-4 w-4 mr-2" />
                    Producto eliminado con éxito
                </div>
            })
        } catch (error: any) {
            if (error.response.status === 409) {
                if (error.response.data === "fk-constraint-failed") {
                    toast({
                        title: "No se puede eliminar el producto",
                        description: "No se puede eliminar el producto. Aparece en ventas o compras registradas.",
                        variant: "destructive",
                    })
                } else {
                    toast({
                        title: "Ocurrió un error inesperado",
                        description: "Por favor comunícate con el soporte para solucionar el inconveniente",
                        variant: "destructive",
                    })
                }
            }
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
                title="¿Borrar venta?"
                description={
                    <>
                        Se eliminará la venta, esta acción es destructiva y no se puede deshacer.
                        <br />
                        Se devolverá la cantidad de stock de cada producto al inventario.
                    </>
                }

                buttonMessage="Confirmar"
            />
            {/*
             When opening a modal from a Dropdown menu, the moment the modal closes the whole page becomes unresponsive,
             to fix it we add modal={false} to the Dropdown (https://github.com/shadcn-ui/ui/issues/1912)
            */}
            <div className="flex gap-x-2">
                <DropdownMenu modal={false}>
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
                        <DropdownMenuItem onClick={() => router.push(`/ventas/${data["ID"]}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/ventas/${data["ID"]}/imprimir`)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </>
    );
};