/**
 * @module lib/rbac
 * Central Role-Based Access Control definitions.
 *
 * Maps each {@link UserRole} to its granted {@link Permission} set
 * and exports helpers consumed throughout the app.
 *
 * ─── Role Descriptions ───
 *  • Fleet Manager     – Full oversight of vehicles, maintenance, scheduling.
 *  • Dispatcher        – Create trips, assign drivers, validate cargo loads.
 *  • Safety Officer    – Monitor driver compliance, license expiry, scores.
 *  • Financial Analyst – Audit fuel spend, maintenance ROI, operational costs.
 */

import type { Permission, UserRole, NavItem } from "../types";

/* ─── Permission Matrix ─── */

/**
 * Master permission map.
 * Each role is an array of granted permissions.
 * To add a new permission simply extend the {@link Permission} union
 * in `types.ts` and add it here.
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  fleet_manager: [
    // Dashboard
    "dashboard:view",
    // Vehicles — full CRUD + service toggle
    "vehicles:view",
    "vehicles:create",
    "vehicles:edit",
    "vehicles:delete",
    "vehicles:service_toggle",
    // Trips — view + edit (scheduling)
    "trips:view",
    "trips:edit",
    // Dispatcher — view only
    "dispatcher:view",
    // Maintenance — full CRUD
    "maintenance:view",
    "maintenance:create",
    "maintenance:edit",
    "maintenance:delete",
    // Drivers — view only (oversight)
    "drivers:view",
    // Expenses — view only
    "expenses:view",
    // Analytics — view + export
    "analytics:view",
    "analytics:export",
    // Settings
    "settings:view",
    "settings:edit",
  ],

  dispatcher: [
    // Dashboard
    "dashboard:view",
    // Vehicles — view only
    "vehicles:view",
    // Trips — full CRUD
    "trips:view",
    "trips:create",
    "trips:edit",
    "trips:delete",
    // Dispatcher — create + assign
    "dispatcher:view",
    "dispatcher:create",
    "dispatcher:assign",
    // Drivers — view + toggle duty status
    "drivers:view",
    "drivers:toggle_duty",
    // Expenses — view only
    "expenses:view",
    // Settings
    "settings:view",
  ],

  safety_officer: [
    // Dashboard
    "dashboard:view",
    // Vehicles — view only
    "vehicles:view",
    // Trips — view only
    "trips:view",
    // Drivers — view + edit + toggle + remove
    "drivers:view",
    "drivers:create",
    "drivers:edit",
    "drivers:toggle_duty",
    "drivers:remove",
    // Performance page
    "maintenance:view",
    // Settings
    "settings:view",
  ],

  financial_analyst: [
    // Dashboard
    "dashboard:view",
    // Vehicles — view only
    "vehicles:view",
    // Trips — view only
    "trips:view",
    // Maintenance — view only (ROI auditing)
    "maintenance:view",
    // Expenses — full access
    "expenses:view",
    "expenses:create",
    "expenses:edit",
    "expenses:approve",
    // Analytics — full access
    "analytics:view",
    "analytics:export",
    // Settings
    "settings:view",
  ],
} as const;

/* ─── Helpers ─── */

/** Check whether `role` has a specific `permission`. */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] as readonly Permission[]).includes(permission);
}

/** Check whether `role` has **all** of the listed permissions. */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/** Check whether `role` has **at least one** of the listed permissions. */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Filter navigation items to only those the `role` may access.
 * Items without a `requiredPermission` are always included.
 */
export function filterNavItems(items: NavItem[], role: UserRole): NavItem[] {
  return items.filter(
    (item) => !item.requiredPermission || hasPermission(role, item.requiredPermission),
  );
}
