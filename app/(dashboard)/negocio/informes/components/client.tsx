"use client"

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import RevenueCard from "@/components/ui/revenue-card";
import { Toggle } from "@/components/ui/toggle";

export const dynamic = 'force-dynamic';

interface InformesClientInterface {
    currentReport: string;
}

export const InformesClient: React.FC<InformesClientInterface> = ({
    currentReport,
}) => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const daily = searchParams.get('daily') === "true";
    const weekly = searchParams.get('weekly') === "true";
    const monthly = searchParams.get('monthly') === "true";
    const historic = searchParams.get('historic') === "true";

    const date = new Date();
    const fullDate = format(date, "dd MMMM, yyyy", { locale: es });
    const month = capitalizeFirstLetter(format(date, "MMMM", { locale: es }));

    const title =
        daily ? "Totales de los services finalizados de hoy"
            : weekly ? "Totales de los services finalizados de esta semana"
                : monthly ? "Totales de los services finalizados de este mes"
                    : historic ? "Total histórico de los services finalizados"
                        : "Informes";

    const optionalDesc =
        daily ? fullDate
            : weekly ? "Contabilizada de Domingo a Sábado"
                : monthly ? month
                    : historic ? ""
                        : "Utiliza los botones de arriba para ver un informe";

    const description1 = "(items incluídos)"
    const description2 = "(items excluídos)"

    return (
        <div className="pb-[20%]">
            {/* background */}
            <div className="absolute bg-transparent w-full min-h-screen pattern-wavy pattern-blue-100 pattern-bg-white dark:pattern-accent-foreground pattern-size-6 pattern-opacity-100 pb-[15%]">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <Card className="flex gap-x-2 items-center justify-center py-1">
                        <Toggle
                            pressed={historic}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/informes?historic=true`) : router.push(`/informes`)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", !historic && "hidden")} />
                            Histórico
                        </Toggle>
                        <Toggle
                            pressed={monthly}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/informes?monthly=true`) : router.push(`/informes`)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", !monthly && "hidden")} />
                            Este mes
                        </Toggle>
                        <Toggle
                            pressed={weekly}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/informes?weekly=true`) : router.push(`/informes`)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", !weekly && "hidden")} />
                            Esta semana
                        </Toggle>
                        <Toggle
                            pressed={daily}
                            onPressedChange={(pressed) => pressed.valueOf() ? router.push(`/informes?daily=true`) : router.push(`/informes`)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", !daily && "hidden")} />
                            Hoy
                        </Toggle>
                    </Card>

                    <div className="flex flex-col gap-y-4 xl:flex-row xl:gap-x-4">
                        <RevenueCard
                            title={title}
                            optionalDesc={optionalDesc}
                            description1={description1}
                            revenue1={currentReport || "-"}
                            description2={description2}
                            revenue2={"-"}
                        />

                        {/* <Card className="w-full">
                            <CardContent className="py-4">
                                {(weekly || monthly || historic || daily) &&
                                    <RevenueChart chartData={currentRevenueChartData || []} />
                                }
                            </CardContent>
                        </Card> */}
                    </div>
                </div>
            </div>
        </div>
    );
}