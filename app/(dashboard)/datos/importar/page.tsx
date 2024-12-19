import { Header } from "@/components/ui/header";
import { ImportClient } from "./components/client";


export const metadata = {
    title: "Importar",
}

const ImportPage = async () => {
    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Importar datos',
            url: '/datos/importar'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6t">
                    <ImportClient />
                </div>
            </div>
        </>
    );
}

export default ImportPage;