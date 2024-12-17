import { UnitType } from "@prisma/client";

export type SerializedProduct = {
    name: string;
    id: number;
    description: string | null;
    brand: string;
    sellingPrice: number;
    unitType: UnitType;
    stock: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type SerializedPurchase = {
    id: number;
    productId: number;
    totalCost: number;
    amount: number;
    supplier: string | null;
    createdAt: Date;
    updatedAt: Date;
    product: SerializedProduct;
} | null

export type SerializedSale = {
    totalPrice: number;
    saleItems: {
        calculatedPrice: number;
        quantity: number;
        id: number;
        unitType: UnitType;
        saleId: number;
        productId: number;
        name: string;
        brand: string;
    }[];
    id: number;
    createdAt: Date;
    updatedAt: Date;
} | null