/**
 * @module maintenance/constants
 * Shared constants, types, and seed data for the Maintenance & Service Logs page.
 */

/* ─── Service Log Status ─── */

/** Possible statuses for a service/maintenance log entry. */
export type ServiceStatus = "New" | "In Shop" | "Completed" | "Cancelled";

/** Status badge colour map. */
export const statusStyles: Record<ServiceStatus, string> = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Shop": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Cancelled: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

/* ─── Service Log Entry ─── */

/** A single maintenance / service log record. */
export interface ServiceLog {
  /** Unique log identifier (e.g. "#321"). */
  id: string;
  /** Vehicle associated with this service. */
  vehicle: {
    /** Vehicle display name / model. */
    name: string;
    /** License plate. */
    licensePlate: string;
    /** Material Symbols icon name. */
    icon: string;
  };
  /** Primary issue or service type (e.g. "Engine Overheating"). */
  issue: string;
  /** Secondary description (e.g. "Diagnostic Check"). */
  serviceType: string;
  /** Date of the service (display string). */
  date: string;
  /** Cost in ₹. */
  cost: number;
  /** Current log status. */
  status: ServiceStatus;
}

/* ─── Filter ─── */

/** Tab filter for the service logs table. */
export type MaintenanceTabFilter = "All" | "New" | "In Shop" | "Completed";

/* ─── Group / Sort / Filter options (toolbar buttons) ─── */

export type GroupByOption = "None" | "Vehicle" | "Status" | "Month";
export type SortByOption = "Date (Newest)" | "Date (Oldest)" | "Cost (High)" | "Cost (Low)" | "ID";
export type FilterByOption = "All Statuses" | "New" | "In Shop" | "Completed" | "Cancelled";

/* ─── Seed Data (24 records matching the design) ─── */

export const serviceLogs: ServiceLog[] = [
  { id: "#321", vehicle: { name: "TATA Prima", licensePlate: "MH 12 AB 1234", icon: "local_shipping" }, issue: "Engine Overheating", serviceType: "Diagnostic Check", date: "Feb 20, 2024", cost: 10500, status: "New" },
  { id: "#318", vehicle: { name: "Ashok Leyland", licensePlate: "KA 01 CD 5678", icon: "local_shipping" }, issue: "Routine Maintenance", serviceType: "Oil Change, Tire Rotation", date: "Feb 18, 2024", cost: 5200, status: "In Shop" },
  { id: "#315", vehicle: { name: "Eicher Pro", licensePlate: "DL 4C XY 9876", icon: "local_shipping" }, issue: "Brake Failure", serviceType: "Pad Replacement", date: "Feb 15, 2024", cost: 15000, status: "Completed" },
  { id: "#310", vehicle: { name: "Mahindra Bolero", licensePlate: "TN 02 BB 3344", icon: "local_shipping" }, issue: "Clutch Issue", serviceType: "Plate Replacement", date: "Feb 12, 2024", cost: 8500, status: "Completed" },
  { id: "#308", vehicle: { name: "Volvo FH16", licensePlate: "KA 01 EQ 1234", icon: "local_shipping" }, issue: "Transmission Repair", serviceType: "Gearbox Overhaul", date: "Feb 10, 2024", cost: 22000, status: "Completed" },
  { id: "#305", vehicle: { name: "BharatBenz 1617", licensePlate: "DL 05 CD 3344", icon: "local_shipping" }, issue: "Electrical Fault", serviceType: "Wiring Inspection", date: "Feb 08, 2024", cost: 6800, status: "In Shop" },
  { id: "#302", vehicle: { name: "Tata Signa", licensePlate: "UP 32 KL 9900", icon: "local_shipping" }, issue: "Suspension Damage", serviceType: "Leaf Spring Replacement", date: "Feb 05, 2024", cost: 12500, status: "Completed" },
  { id: "#299", vehicle: { name: "Ford Transit 350", licensePlate: "XYZ-9876", icon: "airport_shuttle" }, issue: "AC Malfunction", serviceType: "Compressor Replacement", date: "Feb 03, 2024", cost: 9200, status: "New" },
  { id: "#296", vehicle: { name: "Kenworth T680", licensePlate: "KW-4421-B", icon: "local_shipping" }, issue: "Turbo Failure", serviceType: "Turbocharger Replacement", date: "Jan 30, 2024", cost: 35000, status: "In Shop" },
  { id: "#293", vehicle: { name: "Peterbilt 579", licensePlate: "PB-1100-C", icon: "local_shipping" }, issue: "Exhaust Leak", serviceType: "DPF Cleaning", date: "Jan 28, 2024", cost: 7500, status: "Completed" },
  { id: "#290", vehicle: { name: "Freightliner M2 106", licensePlate: "ABC-1234", icon: "local_shipping" }, issue: "Coolant Leak", serviceType: "Radiator Replacement", date: "Jan 25, 2024", cost: 18000, status: "Completed" },
  { id: "#287", vehicle: { name: "Ashok Leyland Boss", licensePlate: "MP 04 MN 1122", icon: "local_shipping" }, issue: "Steering Issue", serviceType: "Power Steering Pump", date: "Jan 22, 2024", cost: 11000, status: "Completed" },
  { id: "#284", vehicle: { name: "Eicher Pro 6049", licensePlate: "HR 26 OP 3344", icon: "local_shipping" }, issue: "Battery Dead", serviceType: "Battery Replacement", date: "Jan 20, 2024", cost: 4500, status: "Completed" },
  { id: "#281", vehicle: { name: "Mahindra Blazo", licensePlate: "RJ 14 FG 5566", icon: "local_shipping" }, issue: "Fuel Injector", serviceType: "Injector Replacement", date: "Jan 18, 2024", cost: 14000, status: "In Shop" },
  { id: "#278", vehicle: { name: "RAM 3500 Tradesman", licensePlate: "RM-5567", icon: "local_shipping" }, issue: "Tyre Puncture", serviceType: "Tyre Replacement (x2)", date: "Jan 15, 2024", cost: 16000, status: "Completed" },
  { id: "#275", vehicle: { name: "Isuzu NPR-HD", licensePlate: "IS-3321", icon: "local_shipping" }, issue: "Oil Leak", serviceType: "Gasket Replacement", date: "Jan 12, 2024", cost: 7800, status: "Completed" },
  { id: "#272", vehicle: { name: "Volvo FM 380", licensePlate: "AP 09 HJ 7788", icon: "local_shipping" }, issue: "Routine Maintenance", serviceType: "Full Service", date: "Jan 10, 2024", cost: 9500, status: "Completed" },
  { id: "#269", vehicle: { name: "Mercedes Sprinter 2500", licensePlate: "MB-7788", icon: "airport_shuttle" }, issue: "Brake Noise", serviceType: "Rotor Resurfacing", date: "Jan 08, 2024", cost: 5500, status: "Completed" },
  { id: "#266", vehicle: { name: "Hino L6 Flatbed", licensePlate: "HN-6644", icon: "rv_hookup" }, issue: "Hydraulic Failure", serviceType: "Hydraulic Hose Repair", date: "Jan 05, 2024", cost: 13500, status: "New" },
  { id: "#263", vehicle: { name: "Thermo King Reefer", licensePlate: "TK-2200", icon: "ac_unit" }, issue: "Cooling Unit Fault", serviceType: "Compressor Overhaul", date: "Jan 03, 2024", cost: 28000, status: "In Shop" },
  { id: "#260", vehicle: { name: "Chevrolet Express 3500", licensePlate: "CV-4455", icon: "airport_shuttle" }, issue: "Windshield Crack", serviceType: "Windshield Replacement", date: "Dec 30, 2023", cost: 8000, status: "Completed" },
  { id: "#257", vehicle: { name: "Volvo VNL 860", licensePlate: "VV-8800", icon: "local_shipping" }, issue: "Clutch Wear", serviceType: "Clutch Kit Replacement", date: "Dec 28, 2023", cost: 19500, status: "Completed" },
  { id: "#254", vehicle: { name: "TATA Prima", licensePlate: "MH 12 AB 1234", icon: "local_shipping" }, issue: "Routine Maintenance", serviceType: "Oil Change + Filters", date: "Dec 25, 2023", cost: 4800, status: "Completed" },
  { id: "#251", vehicle: { name: "Tata Ultra", licensePlate: "MH 04 ST 7788", icon: "local_shipping" }, issue: "Starter Motor", serviceType: "Starter Replacement", date: "Dec 22, 2023", cost: 6200, status: "Cancelled" },
];

/** Total number of service log records. */
export const TOTAL_SERVICE_LOGS = serviceLogs.length;
