import prismadb from "@/lib/prismadb";
import { Header } from "@/components/ui/header";
import { BusinessInfoForm } from "./components/business-info-form";

const BusinessInfoPage = async () => {

    const businessInfo = await prismadb.business.findFirst()

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
        {
            name: 'Negocio',
            url: '/negocio'
        },
        {
            name: 'Información',
            url: '/negocio/informacion'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <BusinessInfoForm initialData={businessInfo} />
                </div>
            </div>
        </>
    );
}

export default BusinessInfoPage;