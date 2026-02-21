/**
 * @module analytics/constants
 * Shared constants, style maps and formatting helpers for the
 * Operational Analytics page components.
 */

import type { VehicleHealthStatus } from "../../types";

/* ─── Status Badge Styles ─── */

/** Tailwind classes for each vehicle health status badge. */
export const healthStatusStyles: Record<
  VehicleHealthStatus,
  { bg: string; text: string }
> = {
  Optimal: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  Review: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  Critical: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
  },
};

/* ─── KPI Card Config ─── */

/** Badge style: green for positive, red for negative, blue for neutral. */
export type BadgeVariant = "positive" | "negative" | "neutral";

export interface KpiCardConfig {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  badge: string;
  badgeVariant: BadgeVariant;
}

/* ─── Margin color helper ─── */

/** Returns Tailwind text-colour class based on margin %. */
export function marginColor(margin: number): string {
  if (margin >= 75) return "text-green-600 dark:text-green-400";
  if (margin >= 55) return "text-blue-600 dark:text-blue-400";
  return "text-yellow-600 dark:text-yellow-400";
}

/** Returns Tailwind bar-fill colour class based on margin %. */
export function marginBarColor(margin: number): string {
  if (margin >= 75) return "bg-blue-600";
  if (margin >= 55) return "bg-blue-500";
  return "bg-blue-400";
}

/* ─── Formatters ─── */

/** Format a number as currency ($X,XXX). */
export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

/** Format a positive revenue string with green '+' prefix. */
export function formatRevenue(value: number): string {
  return `+$${value.toLocaleString("en-US")}`;
}

/* ─── Filter / Sort types ─── */

export type AnalyticsStatusFilter = "All" | VehicleHealthStatus;
