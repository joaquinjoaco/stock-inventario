import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterUYU } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { es } from "date-fns/locale";


export const metadata = {
    title: "Productos",
}

const ProductsPage = async () => {
    // fetch all products from the store
    const products = await prismadb.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        sellingPrice: formatterUYU.format(item.sellingPrice.toNumber()),
        stock: item.stock.toNumber(),
        unitType: item.unitType.toUpperCase(),
        brand: item.brand,
        isArchived: item.isArchived,
        isArchivedText: item.isArchived ? "Archivado" : "-",

        createdAt: format(item.createdAt, "dd MMMM, yyyy", { locale: es }),
        updatedAt: format(item.updatedAt, "dd MMMM, yyyy", { locale: es })
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;