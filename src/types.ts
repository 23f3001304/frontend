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

/* ─────────────────────────────────────────────
 *  DRIVER PERFORMANCE
 * ───────────────────────────────────────────── */

/**
 * Possible duty statuses for a registered driver.
 * - `"On Duty"` – actively available for trips.
 * - `"Off Duty"` – not currently working.
 * - `"Suspended"` – suspended due to violations or low performance.
 */
export type DriverDutyStatus = "On Duty" | "Off Duty" | "Suspended";

/** A single driver record in the Driver Performance page. */
export interface Driver {
  /** Unique driver identifier (e.g. `"DR-1045"`). */
  id: string;
  /** Full name of the driver. */
  name: string;
  /** Optional avatar image URL. */
  avatarUrl?: string;
  /** Driver license number (e.g. `"DL-23223"`). */
  licenseNumber: string;
  /** License expiry date as display string (e.g. `"22 Dec 2036"`). */
  licenseExpiry: string;
  /** Days until license expires; if <= 30 a warning is shown. Omit for far-future dates. */
  licenseExpiryDays?: number;
  /** Trip completion rate percentage (0–100). */
  completionRate: number;
  /** Overall safety score percentage (0–100). */
  safetyScore: number;
  /** Number of complaints filed against this driver. */
  complaints: number;
  /** Current duty status. */
  dutyStatus: DriverDutyStatus;
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

/* ─────────────────────────────────────────────
 *  TRIP & EXPENSE
 * ───────────────────────────────────────────── */

/**
 * Possible approval states for a trip expense record.
 * - `"Approved"` – expense has been approved.
 * - `"Pending"` – awaiting review.
 * - `"Rejected"` – expense was rejected.
 */
export type ExpenseStatus = "Approved" | "Pending" | "Rejected";

/* ─────────────────────────────────────────────
 *  OPERATIONAL ANALYTICS
 * ───────────────────────────────────────────── */

/**
 * Possible health statuses for a vehicle in the analytics log.
 * - `"Optimal"` – performing within expected parameters.
 * - `"Review"` – needs review due to borderline metrics.
 * - `"Critical"` – poor performance, requires attention.
 */
export type VehicleHealthStatus = "Optimal" | "Review" | "Critical";

/** A single vehicle row in the Transaction & Performance Log. */
export interface VehicleAnalyticsEntry {
  /** Vehicle identifier (e.g. `"TRK-2049"`). */
  vehicleId: string;
  /** Current health / performance status. */
  status: VehicleHealthStatus;
  /** Fuel efficiency in km/L. */
  fuelEfficiency: number;
  /** Operational cost in dollars. */
  opCost: number;
  /** Revenue generated in dollars. */
  revenue: number;
}

/** Fleet ROI breakdown row used in the Vehicle ROI Analysis panel. */
export interface FleetROI {
  /** Fleet label (e.g. "Fleet A (Heavy Duty)"). */
  label: string;
  /** Margin percentage (0–100). */
  margin: number;
  /** Revenue string for display (e.g. "$42K"). */
  rev: string;
  /** Cost string for display (e.g. "$7.5K"). */
  cost: string;
}

/** Daily fuel efficiency data point for the bar chart. */
export interface FuelEfficiencyDataPoint {
  /** Date label (e.g. "Oct 01"). */
  label: string;
  /** Efficiency value (unitless, rendered as bar height). */
  value: number;
}

/** A single trip expense record. */
export interface TripExpense {
  /** Unique trip/expense identifier (e.g. `"#TR-321"`). */
  id: string;
  /** Driver assigned to this trip. */
  driver: {
    /** Driver's full name. */
    name: string;
    /** Two-letter initials for the avatar circle. */
    initials: string;
    /** Tailwind `bg-*` colour class for the avatar. */
    avatarColor: string;
  };
  /** Vehicle used for this trip. */
  vehicle: string;
  /** Trip distance in km. */
  distance: number;
  /** Fuel expense in dollars. */
  fuelExpense: number;
  /** Miscellaneous expense in dollars. */
  miscExpense: number;
  /** Total cost (fuel + misc). */
  totalCost: number;
  /** Current approval status. */
  status: ExpenseStatus;
}
