"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    Box,
    Command,
    Eye,
    Frame,
    Ham,
    LifeBuoy,
    Map,
    Package,
    PieChart,
    Plus,
    Send,
    Settings2,
    SquareTerminal,
    User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Inventario",
            url: "/inventario",
            icon: Package,
            isActive: true,
            items: [
                {
                    title: "Nuevo producto",
                    url: "#",
                },
                {
                    title: "Cargar stock",
                    url: "#",
                },
                {
                    title: "Ver inventario",
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
                    title: "Nueva compra",
                    url: "#",
                },
                {
                    title: "Ver compras",
                    url: "#",
                }
            ],
        },
        {
            title: "Clientes",
            url: "/clientes",
            icon: User,
            items: [
                {
                    title: "Nuevo cliente",
                    url: "#",
                },
                {
                    title: "Ver clientes",
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
                    title: "Nueva venta",
                    url: "#",
                },
                {
                    title: "Ver ventas",
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
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
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
                                        src={"/avefenix.jpg"}
                                        alt="ave fenix congelados"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Ave Fenix</span>
                                    <span className="truncate text-xs">Empresa</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
