"use client"

import * as React from "react"
import {
    BookOpen,
    Check,
    Import,
    Loader2,
    Package,
    Save,
    Settings2,
    Store,
} from "lucide-react"
import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarThemeToggle } from "./sidebar-theme-toggle"
import Link from "next/link"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { toast } = useToast()

    const data = {
        navMain1: [
            {
                title: "Inventario",
                icon: Package,
                isActive: true,
                items: [
                    {
                        title: "Inventario",
                        url: "/inventario",
                    },
                    {
                        title: "Registrar producto",
                        url: "/inventario/nuevo",
                    },

                ],
            },
            {
                title: "Compras",
                icon: Settings2,
                items: [
                    {
                        title: "Historial de compras",
                        url: "/compras",
                    },
                    {
                        title: "Cargar stock",
                        url: "/compras/nueva",
                    },

                ],
            },
        ],
        navMain2: [
            {
                title: "Ventas",
                icon: BookOpen,
                items: [
                    {
                        title: "Historial de ventas",
                        url: "/ventas",
                    },
                    {
                        title: "Registrar venta",
                        url: "/ventas/nueva",
                    },
                ],
            },
        ],
        navMain3: [
            {
                title: "Negocio",
                icon: Store,
                items: [
                    {
                        title: "Información",
                        url: "/negocio/informacion",
                    },
                ],
            },
        ],
        navSecondary: [
            {
                title: "Exportar datos",
                icon: Save,
                onClick: async () => {
                    await exportInventory();
                    await exportPurchases();
                    await exportSales();
                    await exportSaleItems();
                    await exportBusinessInfo();
                    toast({
                        title: <div className="flex items-center text-green-500">
                            <Check className="h-4 w-4 mr-2" />
                            Datos exportados
                        </div>
                    })
                },
            },
            {
                title: "Importar datos",
                url: "/datos/importar",
                onClick: null,
                icon: Import,
            },
        ],
    }

    const exportInventory = async () => {
        const response = await fetch('/api/export/inventario')
        const data = await response.json()

        if (data.filePath) {
            // Create a link element
            const link = document.createElement('a')
            link.href = data.filePath  // The URL to the file
            link.download = `1_inventario-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

            // Programmatically click the link to trigger the download
            document.body.appendChild(link) // Append the link to the body
            link.click()  // Trigger the download
            document.body.removeChild(link) // Clean up by removing the link element
        } else {
            console.log(data.message)
        }
    }

    const exportPurchases = async () => {
        const response = await fetch('/api/export/compras')
        const data = await response.json()

        if (data.filePath) {
            // Create a link element
            const link = document.createElement('a')
            link.href = data.filePath  // The URL to the file
            link.download = `2_compras-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

            // Programmatically click the link to trigger the download
            document.body.appendChild(link) // Append the link to the body
            link.click()  // Trigger the download
            document.body.removeChild(link) // Clean up by removing the link element
        } else {
            console.log(data.message)
        }
    }

    const exportSales = async () => {
        const response = await fetch('/api/export/ventas')
        const data = await response.json()

        if (data.filePath) {
            // Create a link element
            const link = document.createElement('a')
            link.href = data.filePath  // The URL to the file
            link.download = `3_ventas-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

            // Programmatically click the link to trigger the download
            document.body.appendChild(link) // Append the link to the body
            link.click()  // Trigger the download
            document.body.removeChild(link) // Clean up by removing the link element
        } else {
            console.log(data.message)
        }
    }

    const exportSaleItems = async () => {
        const response = await fetch('/api/export/ventas/saleItems')
        const data = await response.json()

        if (data.filePath) {
            // Create a link element
            const link = document.createElement('a')
            link.href = data.filePath  // The URL to the file
            link.download = `4_ventas_items-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

            // Programmatically click the link to trigger the download
            document.body.appendChild(link) // Append the link to the body
            link.click()  // Trigger the download
            document.body.removeChild(link) // Clean up by removing the link element
        } else {
            console.log(data.message)
        }
    }
    const exportBusinessInfo = async () => {
        const response = await fetch('/api/export/negocio')
        const data = await response.json()

        if (data.filePath) {
            // Create a link element
            const link = document.createElement('a')
            link.href = data.filePath  // The URL to the file
            link.download = `5_negocio-${format(new Date(), "dd-MM-yy HH-mm", { locale: es })}.json`  // Filename for the download

            // Programmatically click the link to trigger the download
            document.body.appendChild(link) // Append the link to the body
            link.click()  // Trigger the download
            document.body.removeChild(link) // Clean up by removing the link element
        } else {
            console.log(data.message)
        }
    }
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Image
                                        className="rounded-lg"
                                        src={"/avefenix.jpg"}
                                        alt="ave fenix congelados"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Ave Fenix</span>
                                    <span className="truncate text-xs">Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain title="Stock" items={data.navMain1} />
                <NavMain title="Ventas" items={data.navMain2} />
                <NavMain title="Negocio" items={data.navMain3} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
                <SidebarThemeToggle />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
