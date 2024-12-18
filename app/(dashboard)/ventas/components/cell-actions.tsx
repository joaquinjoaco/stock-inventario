"use client";

import { Check, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import Link from "next/link";

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
                        Deberás ajustar el stock de los productos manualmente en el apartado de inventario.
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
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <TooltipWrapper
                    content="Ver service"
                    icon={<Eye className="h-4 w-4" />}
                    className="hidden 2xl:flex flex-row items-center gap-x-2"
                >
                    <Link
                        className="inline-flex justify-center items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                        href={`/ventas/${data["ID"]}`}
                    // target="_blank"
                    >
                        {/* accesibility feature, screenreaders only 'Ver service' */}
                        <span className="sr-only">Ver detalles</span>
                        <Eye className="h-9 w-9 p-2 hover:bg-accent rounded-md transition-all" />
                    </Link>

                </TooltipWrapper>
            </div>
        </>
    );
};