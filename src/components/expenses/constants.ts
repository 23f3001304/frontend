/**
 * @module expenses/constants
 * Shared constants and types for Expense & Fuel Logging components.
 */

import type { ExpenseStatus } from "../../types";

/** Status badge colour map. */
export const expenseStatusStyles: Record<ExpenseStatus, string> = {
  Approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

/** Tab filter options. */
export type ExpenseTabFilter = "All" | "Approved" | "Pending" | "Rejected";

/** Sort-by options for toolbar. */
export type ExpenseSortByOption = "Date (Newest)" | "Date (Oldest)" | "Cost (High)" | "Cost (Low)" | "Distance (High)" | "Distance (Low)";

/** Filter-by options for toolbar. */
export type ExpenseFilterByOption = "All Statuses" | "Approved" | "Pending" | "Rejected";

/** Group-by options for toolbar. */
export type ExpenseGroupByOption = "None" | "Status" | "Driver" | "Vehicle";

/** Format a number as a dollar currency string. */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/** Format a distance value with unit. */
export function formatDistance(km: number): string {
  return `${km.toLocaleString()} km`;
}
