import { PaymentType } from "@prisma/client";

export type SerializedProduct = {
    name: string;
    id: string;
    description: string | null;
    brand: string;
    sellingPrice: number;
    unitType: string;
    stock: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type SerializedPurchase = {
    id: string;
    productId: string;
    totalCost: number;
    amount: number;
    supplier: string | null;
    createdAt: Date;
    updatedAt: Date;
    product: SerializedProduct | null;
} | null

export type SerializedSale = {
    totalPrice: number;
    paymentType: PaymentType;
    saleItems: {
        calculatedPrice: number;
        quantity: number;
        id: string;
        unitType: string;
        saleId: string;
        productId: string;
        name: string;
        brand: string;
    }[];
    id: string;
    createdAt: Date;
    updatedAt: Date;
} | null