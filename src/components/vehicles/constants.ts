/**
 * @module vehicles/constants
 * Shared constants and types for Vehicle Registry components.
 */

import type { VehicleStatus, VehicleCategory } from "../../types";

/** Status badge colour map. */
export const statusStyles: Record<VehicleStatus, string> = {
  Available: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "On Trip": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "In Shop": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Retired: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

/** Status indicator dot colour map. */
export const statusDot: Record<VehicleStatus, string> = {
  Available: "bg-green-500",
  "On Trip": "bg-blue-500",
  "In Shop": "bg-orange-500",
  Retired: "bg-gray-400",
};

/** Tab filter options. */
export type TabFilter = "All" | "Active" | "In Maintenance";

/** Rows per page. */
export const PAGE_SIZE = 5;

/** All vehicle categories for the dropdown filter. */
export const vehicleCategories: VehicleCategory[] = [
  "Box Truck",
  "Cargo Van",
  "Semi-Trailer",
  "Electric Bike",
  "Pickup Truck",
  "Flatbed",
  "Refrigerated",
];
