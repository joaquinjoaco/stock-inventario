import { UnitType } from "@prisma/client";

export type SerializedProduct = {
    name: string;
    id: number;
    description: string | null;
    brand: string | null;
    sellingPrice: Number;
    unitType: UnitType;
    stock: Number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
} | null

export type SerializedPurchase = {
    id: number;
    productId: number;
    totalCost: Number;
    amount: Number;
    supplier: string | null;
    createdAt: Date;
    updatedAt: Date;
    product: SerializedProduct;
} | null
