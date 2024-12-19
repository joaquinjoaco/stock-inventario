import prismadb from "@/lib/prismadb";
import { serializeSale } from "@/lib/utils";
import ImprimirVentaClient from "./components/client";

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
    const id = saleId === 'nueva' ? -1 : params.saleId

    const businessInfo = await prismadb.business.findFirst()

    const sale = await prismadb.sale.findUnique({
        where: {
            id: Number(id)
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
        <ImprimirVentaClient data={serializedSale} business={businessInfo} />
    );
}

export default ImprimirVentaPage;