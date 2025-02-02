import { Header } from "@/components/ui/header";
import { ExportClient } from "./components/client";


export const metadata = {
    title: "Exportar",
}

const ImportPage = async () => {
    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Exportar datos',
            url: '/datos/exportar'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <ExportClient />
                </div>
            </div>
        </>
    );
}

export default ImportPage;