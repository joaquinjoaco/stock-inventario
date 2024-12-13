import { AppSidebar } from "@/components/app-siderbar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
