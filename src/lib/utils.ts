import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Tool } from "./types"

/** Annualize starting_price so monthly and annual figures compare honestly. */
export function annualizedPrice(tool: Tool): number {
  return tool.price_period === "month" ? tool.starting_price * 12 : tool.starting_price;
}

/** Human-readable period suffix for displaying starting_price. */
export function priceSuffix(tool: Tool): string {
  return tool.price_period === "month" ? "/month" : tool.price_period === "one-time" ? "one-time" : "/year";
}
