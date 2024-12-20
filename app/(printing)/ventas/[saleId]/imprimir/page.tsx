import prismadb from "@/lib/prismadb";
import { serializeSale } from "@/lib/utils";
import ImprimirVentaClient from "./components/client";
import Link from "next/link";

export const metadata = {
    title: "Imprimir",
}

const ImprimirVentaPage = async (
    props: {
        params: Promise<{ saleId: string }>
    }
) => {
    const params = await props.params;

    const { saleId } = params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    // const id = saleId === 'nueva' ? -1 : params.saleId

    const businessInfo = await prismadb.business.findFirst()

    const sale = await prismadb.sale.findUnique({
        where: {
            id: saleId
        },
        include: {
            saleItems: {
                include: {
                    product: true,
                }
            }
        }
    });

    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedSale = serializeSale(sale)

    return (
        <>
            {businessInfo ?
                <ImprimirVentaClient data={serializedSale} business={businessInfo} />
                :
                <div className="absolute bg-transparent w-full min-h-screen pattern-wavy pattern-blue-100 pattern-bg-white dark:pattern-accent-foreground pattern-size-6 pattern-opacity-100">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                            <p className="font-semibold text-lg">
                                Ups!
                            </p>
                            <p>
                                No se encontró información válida del negocio para poder imprimir.
                            </p>
                            <div className="my-2">
                                <Link className="underline" href="/negocio/informacion">Rellenar información</Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default ImprimirVentaPage;