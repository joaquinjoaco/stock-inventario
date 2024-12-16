"use client"

import * as React from "react"
import {
    BookOpen,
    Import,
    Package,
    Save,
    Settings2,
    User,
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

const data = {
    navMain1: [
        {
            title: "Inventario",
            icon: Package,
            isActive: true,
            items: [
                {
                    title: "Registrar producto",
                    url: "/inventario/nuevo",
                },
                {
                    title: "Inventario",
                    url: "/inventario",
                },
            ],
        },
        {
            title: "Compras",
            icon: Settings2,
            items: [
                {
                    title: "Cargar stock",
                    url: "/compras/nueva",
                },
                {
                    title: "Historial de compras",
                    url: "/compras",
                }
            ],
        },
    ],
    navMain2: [
        {
            title: "Clientes",
            icon: User,
            items: [
                {
                    title: "Registrar cliente",
                    url: "#",
                },
                {
                    title: "Mis clientes",
                    url: "#",
                },
            ],
        },
        {
            title: "Ventas",
            icon: BookOpen,
            items: [
                {
                    title: "Registrar venta",
                    url: "#",
                },
                {
                    title: "Historial de ventas",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Exportar datos",
            url: "/exportar",
            icon: Save,
        },
        {
            title: "Importar datos",
            url: "/importar",
            icon: Import,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
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
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain title="Stock" items={data.navMain1} />
                <NavMain title="Ventas" items={data.navMain2} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
                <SidebarThemeToggle />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
