"use client"

import * as React from "react"
import {
    BookOpen,
    LifeBuoy,
    Map,
    Package,
    Send,
    Settings2,
    User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { SidebarThemeToggle } from "./sidebar-theme-toggle"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain1: [
        {
            title: "Inventario",
            url: "/inventario",
            icon: Package,
            isActive: true,
            items: [
                {
                    title: "Registrar producto",
                    url: "#",
                },
                {
                    title: "Inventario",
                    url: "#",
                },
            ],
        },
        {
            title: "Compras",
            url: "/compras",
            icon: Settings2,
            items: [
                {
                    title: "Cargar stock",
                    url: "#",
                },
                {
                    title: "Historial de compras",
                    url: "#",
                }
            ],
        },
    ],
    navMain2: [
        {
            title: "Clientes",
            url: "/clientes",
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
            url: "/ventas",
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
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
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
                <>
                    <NavSecondary items={data.navSecondary} className="mt-auto" />
                    <SidebarThemeToggle />
                </>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
