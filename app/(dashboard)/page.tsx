import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/ui/header"
import { Package } from "lucide-react"

export default function Page() {

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Card className="w-full md:max-w-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="w-2 self-stretch bg-gradient-to-b from-slate-500 to-slate-600"></div>
                            <CardContent className="flex-1 p-6 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-x-2">
                                        <Package className="h-6 w-6" />
                                        <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-200">
                                            Productos
                                        </h2>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        N Productos en stock
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        N Productos fuera de stock
                                    </p>
                                </div>
                                <div className="ml-4">

                                </div>
                            </CardContent>
                        </div>
                    </Card>
                </div>
                <div className="min-h-[100vh]flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </>
    )
}
