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
}