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
