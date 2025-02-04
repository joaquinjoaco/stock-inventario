import prismadb from "@/lib/prismadb";
import { serializePurchase } from "@/lib/utils";
import ImprimirCompraClient from "./components/client";
import Link from "next/link";

export const metadata = {
    title: "Imprimir",
}

const ImprimirCompraPage = async (
    props: {
        params: Promise<{ purchaseId: string }>
    }
) => {
    const params = await props.params;

    const { purchaseId } = params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).

    const businessInfo = await prismadb.business.findFirst()

    const purchase = await prismadb.purchase.findUnique({
        where: {
            id: purchaseId
        },
        include: {
            purchaseItems: {
                include: {
                    product: true,
                }
            }
        }
    });

    // Use a helper function to convert 'Decimal' fields to 'Number'.
    const serializedPurchase = serializePurchase(purchase)

    return (
        <>
            {businessInfo ?
                <ImprimirCompraClient data={serializedPurchase} business={businessInfo} />
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

export default ImprimirCompraPage;