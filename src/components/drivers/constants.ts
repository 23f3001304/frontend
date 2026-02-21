/**
 * @module drivers/constants
 * Shared constants and types for Driver Performance components.
 */

import type { DriverDutyStatus } from "../../types";

/** Status badge colour map for duty status. */
export const dutyStatusStyles: Record<DriverDutyStatus, string> = {
  "On Duty": "text-green-700 dark:text-green-400",
  "Off Duty": "text-gray-500 dark:text-gray-400",
  Suspended: "text-red-600 dark:text-red-400",
};

/** Toggle colour map for duty status. */
export const dutyToggleColor: Record<DriverDutyStatus, string> = {
  "On Duty": "bg-primary",
  "Off Duty": "bg-gray-300 dark:bg-gray-600",
  Suspended: "bg-red-400 dark:bg-red-600",
};

/** Tab filter options. */
export type DriverTabFilter = "All" | "On Duty" | "Off Duty" | "Suspended";

/** Group-by options for toolbar. */
export type DriverGroupByOption = "None" | "Status" | "Compliance";

/** Filter-by options for toolbar. */
export type DriverFilterByOption = "All Statuses" | "On Duty" | "Off Duty" | "Suspended";

/** Get the colour class for a completion rate percentage. */
export function completionRateColor(rate: number): string {
  if (rate >= 90) return "text-green-600 dark:text-green-400";
  if (rate >= 70) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

/** Get the ring SVG stroke colour for a safety score. */
export function safetyScoreColor(score: number): string {
  if (score >= 80) return "stroke-green-500";
  if (score >= 50) return "stroke-orange-500";
  return "stroke-red-500";
}

/** Get the text colour class for a safety score. */
export function safetyScoreTextColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

/** Compliance level based on safety score. */
export function complianceLevel(score: number): "good" | "warning" | "critical" {
  if (score >= 80) return "good";
  if (score >= 50) return "warning";
  return "critical";
}
