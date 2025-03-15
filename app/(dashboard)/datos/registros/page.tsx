import prismadb from "@/lib/prismadb";
import { Header } from "@/components/ui/header";
import { LogAlert } from "@/components/ui/log-alert";
import { Log } from "@prisma/client";
import { es } from "date-fns/locale";
import { format } from "date-fns";

export const metadata = {
    title: "Registros",
}

const LogsPage = async () => {

    const logs = await prismadb.log.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Registros',
            url: '/datos/registros'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    //
                    {logs.map((log: Log) => (
                        <LogAlert
                            key={log.id}
                            title={log.action}
                            date={format(log.createdAt, "dd/MM/yy HH:mm", { locale: es })}
                            entityId={log.entityId}
                            details={log.details}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default LogsPage;