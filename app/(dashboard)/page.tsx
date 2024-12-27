import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, BookOpen, Calendar, ExternalLink, Package, PackageX } from "lucide-react";
import { Header } from "@/components/ui/header"
import { formatterUYU } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { getCurrentDaySalesCount } from "@/actions/day/get-current-day-salesCount";
import { getCurrentDayPurchasesCount } from "@/actions/day/get-current-day-purchasesCount";
import { getCurrentDayPurchasesTotal } from "@/actions/day/get-current-day-purchasesTotal";
import { getCurrentDaySalesTotal } from "@/actions/day/get-current-day-salesTotal";
import { getCurrentMonthBestSellingProduct } from "@/actions/month/get-current-month-bestSellingProduct";
import { getProductsInStockCount } from "@/actions/get-productsInStockCount";
import { getProductsOutOfStockCount } from "@/actions/get-productsOutOfStockCount";
import { getCurrentWeekSalesCount } from "@/actions/week/get-current-week-salesCount";
import { getCurrentWeekSalesTotal } from "@/actions/week/get-current-week-salesTotal";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { Separator } from "@/components/ui/separator";
import { getCurrentMonthSalesCount } from "@/actions/month/get-current-month-salesCount";
import { getCurrentMonthSalesTotal } from "@/actions/month/get-current-month-salesTotal";
import { getCurrentWeekPurchasesCount } from "@/actions/week/get-current-week-purchasesCount";
import { getCurrentWeekPurchasesTotal } from "@/actions/week/get-current-week-purchasesTotal";
import { getCurrentMonthPurchasesCount } from "@/actions/month/get-current-month-purchasesCount";
import { getCurrentMonthPurchasesTotal } from "@/actions/month/get-current-month-purchasesTotal";
import { Badge } from "@/components/ui/badge";
import { getProductsStockAlert } from "@/actions/get-productsStockAlert";
import { getGivenMonthTop10BestSellingProducts } from "@/actions/month/get-given-month-top10-bestSellingProducts";


export const revalidate = 0
export default async function Page() {

    const breadcrumbs = [
        {
            name: 'Panel',
            url: '/'
        },
    ]
    const today = new Date()
    const todayFormatted = format(today, "dd MMMM, yyyy", { locale: es })
    const todayTime = format(today, "HH:mm", { locale: es })
    const currentMonth = today.getMonth() // 0 based index
    const currentYear = today.getFullYear()

    const salesCountCurrentDay = await getCurrentDaySalesCount()
    const salesTotalCurrentDay = await getCurrentDaySalesTotal()
    const salesCountCurrentWeek = await getCurrentWeekSalesCount()
    const salesTotalCurrentWeek = await getCurrentWeekSalesTotal()
    const salesCountCurrentMonth = await getCurrentMonthSalesCount("ALL")
    const salesCountCurrentMonthDEBITO = await getCurrentMonthSalesCount("DEBITO")
    const salesCountCurrentMonthCREDITO = await getCurrentMonthSalesCount("CREDITO")
    const salesCountCurrentMonthTRANSFERENCIA = await getCurrentMonthSalesCount("TRANSFERENCIA")
    const salesCountCurrentMonthEFECTIVO = await getCurrentMonthSalesCount("EFECTIVO")
    const salesTotalCurrentMonth = await getCurrentMonthSalesTotal()

    const purchasesCountCurrentDay = await getCurrentDayPurchasesCount()
    const purchasesTotalCurrentDay = await getCurrentDayPurchasesTotal()
    const purchasesCountCurrentWeek = await getCurrentWeekPurchasesCount()
    const purchasesTotalCurrentWeek = await getCurrentWeekPurchasesTotal()
    const purchasesCountCurrentMonth = await getCurrentMonthPurchasesCount()
    const purchasesTotalCurrentMonth = await getCurrentMonthPurchasesTotal()
    const productsInStockCountCurrentDay = await getProductsInStockCount()
    const productsOutOfStockCountCurrentDay = await getProductsOutOfStockCount()
    const productsStockAlertCount = await getProductsStockAlert()

    const bestSellingProductCurrentMonth = await getCurrentMonthBestSellingProduct()
    const top10BestSellingProductsCurrentMonth = await getGivenMonthTop10BestSellingProducts(currentMonth, currentYear);

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {/* Inventory */}
                    <Card className="w-full max-w-2xl dark:bg-zinc-950 dark:text-zinc-50">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">Inventario</CardTitle>
                                <div className="flex items-center text-sm dark:text-zinc-400">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {todayFormatted}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <TooltipWrapper className="flex items-center" content={"Ver productos"} icon={<ExternalLink className="h-4 w-4 mr-2 text-green-500" />}>
                                    <Link href={'/inventario'}>
                                        <Card className="dark:border-zinc-800 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900">
                                            <CardContent className="flex items-center p-6">
                                                <Package className="h-7 w-7 text-green-500" />
                                                <div className="ml-4">
                                                    <p className="text-lg font-medium">En Stock</p>
                                                    <p className="text-3xl font-bold text-green-500">{productsInStockCountCurrentDay}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipWrapper>
                                <TooltipWrapper className="flex items-center" content={"Ver productos"} icon={<ExternalLink className="h-4 w-4 mr-2 text-red-500" />}>
                                    <Link href={'/inventario?filter=OOS'}>
                                        <Card className="dark:border-zinc-800 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900">
                                            <CardContent className="flex items-center p-6">
                                                <PackageX className="h-7 w-7 text-red-500" />
                                                <div className="ml-4">
                                                    <p className="text-lg font-medium">Fuera de Stock</p>
                                                    <p className="text-3xl font-bold text-red-500">{productsOutOfStockCountCurrentDay}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipWrapper>
                            </div>

                            {bestSellingProductCurrentMonth &&
                                <TooltipWrapper className="flex items-center" content={"Ver producto"} icon={<ExternalLink className="h-4 w-4 mr-2 text-green-500" />}>
                                    <Link href={`/inventario/${bestSellingProductCurrentMonth?.product ? bestSellingProductCurrentMonth.product.id : ''}`} className="grid gap-4 ">
                                        <Card className="dark:border-zinc-800 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors">
                                            <CardContent className="flex items-center p-6">
                                                <div className="ml-4">
                                                    <p className="dark:text-zinc-100 text-md font-medium">Producto más vendido este mes</p>
                                                    <p className="text-3xl font-bold dark:text-zinc-100">{bestSellingProductCurrentMonth?.product?.name}, {bestSellingProductCurrentMonth?.product?.brand}</p>
                                                    <p className="text-xl font-bold text-green-500">{bestSellingProductCurrentMonth?.quantitySold} vendidos</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipWrapper>
                            }
                            {productsStockAlertCount > 0 &&
                                <TooltipWrapper className="flex items-center" content={"Revisar inventario"} icon={<ExternalLink className="h-4 w-4 mr-2 text-yellow-500" />}>
                                    <Link href={`/inventario`} className="grid gap-4 ">
                                        <Card className="border-yellow-500 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors">
                                            <CardContent className="flex items-center p-6">
                                                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                                                <div className="ml-4">
                                                    <p className="dark:text-zinc-100 text-md font-medium">Productos con stock bajo</p>
                                                    <p className="text-xl font-bold text-yellow-500">{productsStockAlertCount}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </TooltipWrapper>
                            }

                            <div className="rounded-lg border dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                                <h3 className="mb-2 text-lg font-medium">Top 10 productos más vendidos del mes</h3>
                                <div className="grid gap-2 text-sm dark:text-zinc-400">
                                    {top10BestSellingProductsCurrentMonth.map((item, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>{item.product?.name}, {item.product?.brand}</span>
                                            <span className="font-medium dark:text-zinc-100">{item.quantitySold}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="rounded-lg border dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                                <h3 className="mb-2 text-lg font-medium">Resumen de Inventario</h3>
                                <div className="grid gap-2 text-sm dark:text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Total de Productos registrados</span>
                                        <span className="font-medium dark:text-zinc-100">{productsInStockCountCurrentDay + productsOutOfStockCountCurrentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>En stock</span>
                                        <span className="font-medium dark:text-zinc-100">{productsInStockCountCurrentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Fuera de stock</span>
                                        <span className="font-medium dark:text-zinc-100">{productsOutOfStockCountCurrentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Última Actualización</span>
                                        <span className="font-medium dark:text-zinc-100">{todayTime}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales */}
                    <Card className="w-full max-w-2xl dark:bg-zinc-950 dark:text-zinc-50">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">Ventas</CardTitle>
                                <div className="flex items-center text-sm dark:text-zinc-400">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {todayFormatted}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">Del día</p>
                                                <p className="text-3xl font-bold text-green-500">{salesCountCurrentDay}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(salesTotalCurrentDay)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">De la semana</p>
                                                <p className="text-3xl font-bold text-green-500">{salesCountCurrentWeek}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(salesTotalCurrentWeek)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">Del mes</p>
                                                <p className="text-3xl font-bold text-green-500">{salesCountCurrentMonth}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(salesTotalCurrentMonth)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="rounded-lg border dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                                <h3 className="mb-2 text-lg font-medium">Resumen de Ventas</h3>
                                <div className="grid gap-2 text-sm dark:text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Total de ventas del mes</span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentMonth}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total de ventas de la semana</span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentWeek}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total de ventas del día</span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentDay}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between">
                                        <span>Ventas del mes con <Badge className="ml-2">EFECTIVO</Badge></span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentMonthEFECTIVO}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ventas del mes con <Badge className="ml-2">DÉBITO</Badge></span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentMonthDEBITO}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ventas del mes con <Badge className="ml-2">TRANSFERENCIA</Badge></span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentMonthTRANSFERENCIA}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ventas del mes con <Badge className="ml-2">CRÉDITO</Badge></span>
                                        <span className="font-medium dark:text-zinc-100">{salesCountCurrentMonthCREDITO}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Última Actualización</span>
                                        <span className="font-medium dark:text-zinc-100">{todayTime}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Purchases */}
                    <Card className="w-full max-w-2xl dark:bg-zinc-950 dark:text-zinc-50">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">Compras</CardTitle>
                                <div className="flex items-center text-sm dark:text-zinc-400">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {todayFormatted}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">Del día</p>
                                                <p className="text-3xl font-bold text-green-500">{purchasesCountCurrentDay}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(purchasesTotalCurrentDay)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">De la semana</p>
                                                <p className="text-3xl font-bold text-green-500">{purchasesCountCurrentWeek}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(purchasesTotalCurrentWeek)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid gap-4 grid-cols-1">
                                <Card className="dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <CardContent className="flex justify-between p-6">
                                        <div className="flex items-center">
                                            <BookOpen className="h-8 w-8 text-green-500" />
                                            <div className="ml-4">
                                                <p className="text-lg font-medium">Del mes</p>
                                                <p className="text-3xl font-bold text-green-500">{purchasesCountCurrentMonth}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <p className="text-2xl font-normal text-green-500">{formatterUYU.format(purchasesTotalCurrentMonth)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Separator className="dark:bg-zinc-800" />

                            <div className="rounded-lg border dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                                <h3 className="mb-2 text-lg font-medium">Resumen de Compras</h3>
                                <div className="grid gap-2 text-sm dark:text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Total de compras del mes</span>
                                        <span className="font-medium dark:text-zinc-100">{purchasesCountCurrentMonth}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total de compras de la semana</span>
                                        <span className="font-medium dark:text-zinc-100">{purchasesCountCurrentWeek}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total de compras del día</span>
                                        <span className="font-medium dark:text-zinc-100">{purchasesCountCurrentDay}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Última Actualización</span>
                                        <span className="font-medium dark:text-zinc-100">{todayTime}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
