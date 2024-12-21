import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export const dynamic = 'force-dynamic'

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TooltipProvider delayDuration={100}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main>
                        {children}
                    </main>
                    <Toaster />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
