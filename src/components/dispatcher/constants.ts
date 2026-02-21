/**
 * @module dispatcher/constants
 * Shared constants, types, and seed data for Trip Dispatcher components.
 */



/* ─── Vehicle Type Badge ─── */

/** Vehicle type label derived from category for the dispatcher's compact view. */
export type VehicleTypeBadge = "Trailer Truck" | "Cargo Van" | "Heavy Truck" | "Box Truck" | "Other";

/** Maps a vehicle name to a simplified badge for the active trips table. */
export function inferVehicleType(vehicleName: string): VehicleTypeBadge {
  const n = vehicleName.toLowerCase();
  if (n.includes("volvo") || n.includes("trailer") || n.includes("tata") || n.includes("eicher")) return "Trailer Truck";
  if (n.includes("transit") || n.includes("sprinter") || n.includes("express")) return "Cargo Van";
  if (n.includes("kenworth") || n.includes("peterbilt") || n.includes("ashok") || n.includes("bharat") || n.includes("mahindra")) return "Heavy Truck";
  if (n.includes("isuzu") || n.includes("freightliner")) return "Box Truck";
  return "Other";
}

/** Badge icon per vehicle type. */
export const vehicleTypeIcon: Record<VehicleTypeBadge, string> = {
  "Trailer Truck": "local_shipping",
  "Cargo Van": "airport_shuttle",
  "Heavy Truck": "local_shipping",
  "Box Truck": "local_shipping",
  Other: "directions_car",
};

/** Badge colour per vehicle type. */
export const vehicleTypeBgColor: Record<VehicleTypeBadge, string> = {
  "Trailer Truck": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Cargo Van": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Heavy Truck": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "Box Truck": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

/* ─── Trip Progress ─── */

/** Progress status for the active trips table. */
export type TripProgress = "in-transit" | "arrived" | "delayed" | "starting";

/** A single active trip row shown in the dispatcher table. */
export interface ActiveTrip {
  id: string;
  vehicleType: VehicleTypeBadge;
  from: string;
  to: string;
  subtitle: string;
  /** Completion percentage (0–100). */
  progress: number;
  progressStatus: TripProgress;
}

/** Colour for the progress bar track. */
export const progressColor: Record<TripProgress, string> = {
  "in-transit": "bg-primary",
  arrived: "bg-green-500",
  delayed: "bg-red-500",
  starting: "bg-gray-400 dark:bg-gray-500",
};

/** Seed active trips (matches the design). */
export const activeTrips: ActiveTrip[] = [
  { id: "#TR-2023-001", vehicleType: "Trailer Truck", from: "Mumbai", to: "Pune", subtitle: "150 km remaining", progress: 72, progressStatus: "in-transit" },
  { id: "#TR-2023-002", vehicleType: "Cargo Van", from: "Delhi", to: "Jaipur", subtitle: "Arrived at destination", progress: 100, progressStatus: "arrived" },
  { id: "#TR-2023-005", vehicleType: "Heavy Truck", from: "Chennai", to: "Bangalore", subtitle: "Delayed (Traffic)", progress: 55, progressStatus: "delayed" },
  { id: "#TR-2023-008", vehicleType: "Trailer Truck", from: "Kolkata", to: "Bhubaneswar", subtitle: "Starting soon", progress: 10, progressStatus: "starting" },
];

/* ─── Driver data ─── */

/** Available driver for the form dropdown. */
export interface AvailableDriver {
  id: string;
  name: string;
}

/** Seed drivers. */
export const availableDrivers: AvailableDriver[] = [
  { id: "D-01", name: "John Doe" },
  { id: "D-02", name: "Sarah Connor" },
  { id: "D-03", name: "Michael Chen" },
  { id: "D-04", name: "Raj Patel" },
  { id: "D-05", name: "Anita Sharma" },
  { id: "D-06", name: "Vikram Singh" },
];
