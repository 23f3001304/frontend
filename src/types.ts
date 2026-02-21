/**
 * @module types
 * Shared TypeScript interfaces for the Fleet Flow dashboard.
 * Every data structure consumed by components is defined here.
 */

/** Sidebar navigation link definition. */
export interface NavItem {
  /** Material Symbols icon name. */
  icon: string;
  /** Display label for the nav link. */
  label: string;
  /** Route or anchor href. */
  href: string;
  /** Whether this item is the initially-active page. */
  active?: boolean;
}

/** Authenticated user shown in the sidebar profile section. */
export interface UserProfile {
  /** Full display name (e.g. "Alex Morgan"). */
  name: string;
  /** Job title or role description. */
  role: string;
  /** URL for the user's avatar image. */
  avatarUrl: string;
}

/** KPI stat card displayed at the top of the dashboard. */
export interface StatCard {
  /** Material Symbols icon name. */
  icon: string;
  /** Tailwind text colour class for the icon (e.g. `"text-green-500"`). */
  iconColor: string;
  /** Tailwind background class for the icon container. */
  iconBg: string;
  /** Metric label (e.g. "Active Fleet"). */
  label: string;
  /** Numeric or string KPI value (e.g. `220` or `"92%"`). */
  value: string | number;
  /** Footer caption below the value. */
  footer: string;
  /** Tailwind colour class for the footer text. */
  footerColor: string;
}

/**
 * Possible trip lifecycle states displayed as badges.
 * - `"On Trip"` – vehicle is en-route.
 * - `"Loading"` – cargo is being loaded.
 * - `"Maintenance"` – vehicle is in the workshop.
 * - `"Ready"` – available for dispatch.
 */
export type TripStatus = "On Trip" | "Loading" | "Maintenance" | "Ready";

/** A single fleet trip record in the table. */
export interface Trip {
  /** Unique trip identifier (e.g. `"#TR-8832"`). */
  id: string;
  /** Vehicle assigned to this trip. */
  vehicle: {
    /** Vehicle model name. */
    name: string;
    /** Registration / license plate. */
    licensePlate: string;
  };
  /** Assigned driver, or `null` when unassigned. */
  driver: {
    /** Driver's full name. */
    name: string;
    /** Optional avatar image URL. */
    avatarUrl?: string;
  } | null;
  /** Origin → Destination for the trip. */
  route: {
    /** Departure city / location. */
    from: string;
    /** Destination city / location. */
    to: string;
  };
  /** Estimated time of arrival (e.g. `"2h 15m"` or `"--"`). */
  eta: string;
  /** Current trip lifecycle status. */
  status: TripStatus;
}

/** A real-time alert shown in the bottom widget. */
export interface Alert {
  /** Tailwind `bg-*` colour class for the alert dot. */
  color: string;
  /** Human-readable alert message. */
  message: string;
}

/** Breakdown row for the Vehicle Types widget. */
export interface VehicleTypeBreakdown {
  /** Vehicle category label (e.g. "Trucks"). */
  label: string;
  /** Percentage of fleet (0-100). */
  percentage: number;
  /** Tailwind `bg-*` colour class for the progress bar. */
  color: string;
}

/* ─────────────────────────────────────────────
 *  VEHICLE REGISTRY
 * ───────────────────────────────────────────── */

/**
 * Possible operational states for a registered vehicle.
 * - `"Available"` – ready for dispatch.
 * - `"On Trip"` – currently on a route.
 * - `"In Shop"` – undergoing maintenance.
 * - `"Retired"` – decommissioned from the fleet.
 */
export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";

/** Category / class of vehicle. */
export type VehicleCategory =
  | "Box Truck"
  | "Cargo Van"
  | "Semi-Trailer"
  | "Electric Bike"
  | "Pickup Truck"
  | "Flatbed"
  | "Refrigerated";

/** A single vehicle record in the Vehicle Registry. */
export interface Vehicle {
  /** Unique vehicle identifier (e.g. `"VH-001"`). */
  id: string;
  /** Display name / model (e.g. "Freightliner M2 106"). */
  name: string;
  /** Vehicle category / body type. */
  category: VehicleCategory;
  /** Model year (e.g. `2023`). */
  year: number;
  /** License plate string (e.g. `"ABC-1234"`). */
  licensePlate: string;
  /** Maximum payload capacity in lbs. */
  maxCapacity: number;
  /** Current odometer reading in miles. */
  odometer: number;
  /** Current operational status. */
  status: VehicleStatus;
  /** Whether the vehicle is flagged for scheduled service. */
  inService: boolean;
  /** Material Symbols icon name for the vehicle type. */
  icon: string;
}
