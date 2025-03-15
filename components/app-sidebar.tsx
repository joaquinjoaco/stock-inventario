"use client"

import * as React from "react"
import {
    BookOpen,
    FileDown,
    FileUp,
    History,
    Package,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

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
                title: "Importar datos",
                url: "/datos/importar",
                // onClick: null,
                icon: FileUp,
            },
            {
                title: "Exportar datos",
                url: "/datos/exportar",
                // onClick: null,
                icon: FileDown,
            },
            {
                title: "Registros",
                url: "/datos/registros",
                // onClick: null,
                icon: History,
            },
        ],
    }



    return (
        <Sidebar variant="sidebar" className="z-20" {...props} >
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
