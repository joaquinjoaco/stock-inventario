import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LogAction } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface LogAlertProps {
    title: LogAction,
    date: string,
    entityId: string,
    details: string,
};

export const LogAlert: React.FC<LogAlertProps> = ({
    title,
    date,
    entityId,
    details,
}) => {

    const badgeText = title.startsWith("CREAR") ? "Creación" : title.startsWith("ACTUALIZAR") ? "Actualización" : "Eliminación"
    const badgeVariant = title.startsWith("ELIMINAR") ? "destructive" : "default"

    const href = title.includes("COMPRA") ? `/compras/${entityId}` : title.includes("VENTA") ? `/ventas/${entityId}` : title.includes("PRODUCTO") ? `/inventario/${entityId}` : '/negocio/informacion'
    const titleSplit = title.split("_")[1].toLowerCase()

    return (
        <Alert className="mt-4">
            <AlertTitle className="flex justify-between gap-x-2">
                <div className="flex items-center gap-x-2">
                    <p className="mr-2">{titleSplit.toUpperCase()}</p>
                    <Badge variant={badgeVariant}>
                        {badgeText}
                    </Badge>
                    <Badge variant={"outline"}>
                        {date}
                    </Badge>
                </div>
                {!title.startsWith("ELIMINAR") && <div className="flex items-center gap-x-2">
                    <Link
                        href={href}
                        className={(cn(buttonVariants({ variant: "link" })))}
                    >
                        <ArrowRight className="w-4 h-4" />
                        Ver {titleSplit}
                    </Link>
                </div>}
            </AlertTitle>
            <AlertDescription className="mt-4 p-1 flex items-center justify-between bg-muted-foreground/10 dark:bg-muted rounded-md">
                <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {details}
                </code>
                <code className="relative px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    ID: {entityId}
                </code>
            </AlertDescription>
        </Alert>
    )
}