import { Product, Purchase, PurchaseItem, Sale, SaleItem } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatterUYU = new Intl.NumberFormat("es-UY", {
  style: 'currency',
  currency: 'UYU',
  currencyDisplay: 'symbol'
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
    brand: product.brand || "sin marca"
  };
};

// Helper to convert an array of products's Decimal fields to numbers
export const serializeProducts = (products: Product[]) => {
  return products.map((product) => {
    return {
      ...product,
      sellingPrice: product.sellingPrice.toNumber(), // Convert Decimal to number
      stock: product.stock.toNumber(), // Convert Decimal to number
      brand: product.brand || "sin marca"
    };
  });
};

// Helper to convert a purchase's Decimal fields to numbers
export const serializePurchase = (purchase: Purchase & { purchaseItems: (PurchaseItem & { product: Product })[] } | null) => {
  if (!purchase) return null;
  return {
    ...purchase,
    totalCost: purchase.totalCost.toNumber(), // Convert Decimal to number
    // amount: purchase.amount.toNumber(), // Convert Decimal to number
    // product: serializeProduct(purchase.product)
    purchaseItems: purchase.purchaseItems.map((item) => {
      return {
        ...item,
        cost: item.cost.toNumber(),
        quantity: item.quantity.toNumber(),
        name: item.product.name,
        brand: item.product.brand || "sin marca",
        unitType: item.product.unitType,
        product: serializeProduct(item.product),
      }
    })
  };
};


// Helper to convert a sale's Decimal fields to numbers
export const serializeSale = (sale: Sale & { saleItems: (SaleItem & { product: Product })[] } | null) => {
  if (!sale) return null;
  return {
    ...sale,
    totalPrice: sale.totalPrice.toNumber(), // Convert Decimal to number
    discount: sale.discount.toNumber(), // Convert Decimal to number
    saleItems: sale.saleItems.map((item) => {
      return {
        ...item,
        calculatedPrice: item.calculatedPrice.toNumber(),
        quantity: item.quantity.toNumber(),
        name: item.product.name,
        brand: item.product.brand || "sin marca",
        unitType: item.product.unitType,
        product: serializeProduct(item.product),
      }
    })
  };
};