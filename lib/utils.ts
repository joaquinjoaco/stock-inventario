import { Product, Purchase } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatterUYU = new Intl.NumberFormat("en-US", {
  style: 'currency',
  currency: 'UYU',
  currencyDisplay: 'code'
})

export function capitalizeFirstLetter(string: string) {
  if (string.length === 0) return string; // Check if the string is empty
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper to convert a product's Decimal fields to numbers
export const serializeProduct = (product: Product | null) => {
  if (!product) return null;
  return {
    ...product,
    sellingPrice: product.sellingPrice.toNumber(), // Convert Decimal to number
    stock: product.stock.toNumber(), // Convert Decimal to number
  };
};

// Helper to convert an array of products's Decimal fields to numbers
export const serializeProducts = (products: (Product | null)[]) => {
  return products.map((product) => {
    if (!product) return null;
    return {
      ...product,
      sellingPrice: product.sellingPrice.toNumber(), // Convert Decimal to number
      stock: product.stock.toNumber(), // Convert Decimal to number
    };
  });
};

// Helper to convert a purchase's Decimal fields to numbers
export const serializePurchase = (purchase: Purchase & { product: Product } | null) => {
  if (!purchase) return null;
  return {
    ...purchase,
    totalCost: purchase.totalCost.toNumber(), // Convert Decimal to number
    amount: purchase.amount.toNumber(), // Convert Decimal to number
    product: serializeProduct(purchase.product)
  };
};