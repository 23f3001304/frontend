/**
 * @module data
 * Dummy / seed data for the Fleet Flow dashboard.
 * In production these would come from API calls; during development
 * they power every component with realistic placeholder content.
 */

import type {
  NavItem,
  UserProfile,
  StatCard,
  Trip,
  Alert,
  VehicleTypeBreakdown,
  Vehicle,
} from "./types";

/** Primary sidebar navigation items. The `active` flag marks the default page. */
export const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: true },
  { icon: "directions_car", label: "Vehicle Registry", href: "/vehicles" },
  { icon: "map", label: "All Trips", href: "/trips" },
  { icon: "alt_route", label: "Trip Dispatcher", href: "/dispatcher" },
  { icon: "build", label: "Maintenance", href: "/maintenance" },
  { icon: "receipt_long", label: "Trip & Expense", href: "#" },
  { icon: "verified_user", label: "Performance", href: "#" },
  { icon: "analytics", label: "Analytics", href: "#" },
];

/** Signed-in user displayed in the sidebar profile area. */
export const currentUser: UserProfile = {
  name: "Alex Morgan",
  role: "Fleet Manager",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCk35KUeasH1IS5wWE63QoD1FWPHnvbLp3RafhgDBLBJ9GdLsFgOsWJvJNBY6bJTU9aLOKGS3iV9GTH0Ikx1vU8Fwu5B18gzJ47Ffr_NXvSQ-E7Gj6FR9ddD5roE_2iRzRmr7eBwGJm5eHHFU5GP6sV5JMlvx8-yDCQ5yinqTV_Vjo21F8B2ttwygU-DKkByB-2NA66z6EntxnE1nUkala8NmqNspAzZI73dX0fhjDy0l4151zYk15pX_Nq08z-3xNxCZjPZTOmaw",
};

/** KPI statistics rendered as cards above the fleet table. */
export const statCards: StatCard[] = [
  {
    icon: "local_shipping",
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    label: "Active Fleet",
    value: 220,
    footer: "↑ 85% of total fleet",
    footerColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: "warning",
    iconColor: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    label: "Maintenance Alerts",
    value: 12,
    footer: "Requires immediate attention",
    footerColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: "inventory_2",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    label: "Pending Cargo",
    value: 20,
    footer: "Awaiting driver assignment",
    footerColor: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: "trending_up",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    label: "Utilization Rate",
    value: "92%",
    footer: "Calculated daily average",
    footerColor: "text-text-muted-light dark:text-text-muted-dark",
  },
];

/** Seed fleet trips — 12 records covering every `TripStatus`. */
export const trips: Trip[] = [
  {
    id: "#TR-8832",
    vehicle: { name: "Volvo FH16", licensePlate: "KA-01-EQ-1234" },
    driver: {
      name: "John Doe",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBHdvbnzhqIhsEpl7aV26nyvdF6aK7ZoosYERYGdiIyN0M5ZS02Z1NlyeqvxUWweclCv3PN1-9zfxdxpIB_tQiVkMTCRXfo9hRJlrh6s7dvxPTTzMePTXOhnJ-02LrcYvNnzifb-80HsHGNKQ6DX560MRzIVDZyAbJbhF7UJQtnVnLsvBJj4rEV8zu5T4rLgDoUN4KW7OK6nEs99n53_a2eKalz3ncRn5e9chaQYbalxmsxiJrt-jJAvgBOXGujca2PGAoLPbM1A",
    },
    route: { from: "Mumbai", to: "Pune" },
    eta: "2h 15m",
    status: "On Trip",
  },
  {
    id: "#TR-8833",
    vehicle: { name: "Tata Prima", licensePlate: "MH-12-AB-9876" },
    driver: {
      name: "Sarah Connor",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    },
    route: { from: "Delhi", to: "Jaipur" },
    eta: "5h 30m",
    status: "Loading",
  },
  {
    id: "#TR-8834",
    vehicle: { name: "Ashok Leyland", licensePlate: "TN-07-XY-5678" },
    driver: {
      name: "Michael Chen",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    },
    route: { from: "Chennai", to: "Bangalore" },
    eta: "--",
    status: "Maintenance",
  },
  {
    id: "#TR-8835",
    vehicle: { name: "Eicher Pro", licensePlate: "GJ-01-ZZ-1122" },
    driver: null,
    route: { from: "Surat", to: "Ahmedabad" },
    eta: "--",
    status: "Ready",
  },
  {
    id: "#TR-8836",
    vehicle: { name: "BharatBenz 1617", licensePlate: "DL-05-CD-3344" },
    driver: {
      name: "Raj Patel",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBHdvbnzhqIhsEpl7aV26nyvdF6aK7ZoosYERYGdiIyN0M5ZS02Z1NlyeqvxUWweclCv3PN1-9zfxdxpIB_tQiVkMTCRXfo9hRJlrh6s7dvxPTTzMePTXOhnJ-02LrcYvNnzifb-80HsHGNKQ6DX560MRzIVDZyAbJbhF7UJQtnVnLsvBJj4rEV8zu5T4rLgDoUN4KW7OK6nEs99n53_a2eKalz3ncRn5e9chaQYbalxmsxiJrt-jJAvgBOXGujca2PGAoLPbM1A",
    },
    route: { from: "Kolkata", to: "Patna" },
    eta: "4h 10m",
    status: "On Trip",
  },
  {
    id: "#TR-8837",
    vehicle: { name: "Mahindra Blazo", licensePlate: "RJ-14-FG-5566" },
    driver: {
      name: "Anita Sharma",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    },
    route: { from: "Jaipur", to: "Udaipur" },
    eta: "3h 45m",
    status: "On Trip",
  },
  {
    id: "#TR-8838",
    vehicle: { name: "Volvo FM 380", licensePlate: "AP-09-HJ-7788" },
    driver: null,
    route: { from: "Hyderabad", to: "Vijayawada" },
    eta: "--",
    status: "Ready",
  },
  {
    id: "#TR-8839",
    vehicle: { name: "Tata Signa", licensePlate: "UP-32-KL-9900" },
    driver: {
      name: "Vikram Singh",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    },
    route: { from: "Lucknow", to: "Varanasi" },
    eta: "6h 00m",
    status: "Loading",
  },
  {
    id: "#TR-8840",
    vehicle: { name: "Ashok Leyland Boss", licensePlate: "MP-04-MN-1122" },
    driver: {
      name: "Priya Verma",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    },
    route: { from: "Bhopal", to: "Indore" },
    eta: "3h 20m",
    status: "On Trip",
  },
  {
    id: "#TR-8841",
    vehicle: { name: "Eicher Pro 6049", licensePlate: "HR-26-OP-3344" },
    driver: {
      name: "Suresh Kumar",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCBHdvbnzhqIhsEpl7aV26nyvdF6aK7ZoosYERYGdiIyN0M5ZS02Z1NlyeqvxUWweclCv3PN1-9zfxdxpIB_tQiVkMTCRXfo9hRJlrh6s7dvxPTTzMePTXOhnJ-02LrcYvNnzifb-80HsHGNKQ6DX560MRzIVDZyAbJbhF7UJQtnVnLsvBJj4rEV8zu5T4rLgDoUN4KW7OK6nEs99n53_a2eKalz3ncRn5e9chaQYbalxmsxiJrt-jJAvgBOXGujca2PGAoLPbM1A",
    },
    route: { from: "Chandigarh", to: "Amritsar" },
    eta: "4h 30m",
    status: "On Trip",
  },
  {
    id: "#TR-8842",
    vehicle: { name: "Volvo FH520", licensePlate: "KA-03-QR-5566" },
    driver: null,
    route: { from: "Bangalore", to: "Mysore" },
    eta: "--",
    status: "Maintenance",
  },
  {
    id: "#TR-8843",
    vehicle: { name: "Tata Ultra", licensePlate: "MH-04-ST-7788" },
    driver: {
      name: "Deepak Joshi",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    },
    route: { from: "Pune", to: "Nashik" },
    eta: "2h 50m",
    status: "Loading",
  },
];

/** Vehicle category breakdown for the bottom-left widget. */
export const vehicleTypes: VehicleTypeBreakdown[] = [
  { label: "Trucks", percentage: 60, color: "bg-primary" },
  { label: "Vans", percentage: 30, color: "bg-blue-400" },
];

/** Alerts shown in the bottom-centre widget. */
export const recentAlerts: Alert[] = [
  { color: "bg-red-500", message: "Engine issue reported for Vehicle #TR-8834" },
  { color: "bg-orange-500", message: "Driver license expiring for John Doe" },
];

/** Simulated total-row count for pagination (as if backed by an API). */
export const TOTAL_RESULTS = 220;

/* ─────────────────────────────────────────────
 *  VEHICLE REGISTRY
 * ───────────────────────────────────────────── */

/** Vehicles shown in the Vehicle Registry page. */
export const vehicles: Vehicle[] = [
  {
    id: "VH-001",
    name: "Freightliner M2 106",
    category: "Box Truck",
    year: 2023,
    licensePlate: "ABC-1234",
    maxCapacity: 15000,
    odometer: 45200,
    status: "Available",
    inService: false,
    icon: "local_shipping",
  },
  {
    id: "VH-002",
    name: "Ford Transit 350",
    category: "Cargo Van",
    year: 2022,
    licensePlate: "XYZ-9876",
    maxCapacity: 3500,
    odometer: 12100,
    status: "On Trip",
    inService: false,
    icon: "airport_shuttle",
  },
  {
    id: "VH-003",
    name: "Kenworth T680",
    category: "Semi-Trailer",
    year: 2021,
    licensePlate: "KW-4421-B",
    maxCapacity: 45000,
    odometer: 189450,
    status: "In Shop",
    inService: true,
    icon: "local_shipping",
  },
  {
    id: "VH-004",
    name: "Rad Power Cargo 4",
    category: "Electric Bike",
    year: 2020,
    licensePlate: "BK-990",
    maxCapacity: 350,
    odometer: 4500,
    status: "Retired",
    inService: true,
    icon: "pedal_bike",
  },
  {
    id: "VH-005",
    name: "RAM 3500 Tradesman",
    category: "Pickup Truck",
    year: 2024,
    licensePlate: "RM-5567",
    maxCapacity: 7500,
    odometer: 8300,
    status: "Available",
    inService: false,
    icon: "local_shipping",
  },
  {
    id: "VH-006",
    name: "Isuzu NPR-HD",
    category: "Box Truck",
    year: 2022,
    licensePlate: "IS-3321",
    maxCapacity: 14500,
    odometer: 67800,
    status: "On Trip",
    inService: false,
    icon: "local_shipping",
  },
  {
    id: "VH-007",
    name: "Mercedes Sprinter 2500",
    category: "Cargo Van",
    year: 2023,
    licensePlate: "MB-7788",
    maxCapacity: 4200,
    odometer: 19500,
    status: "Available",
    inService: false,
    icon: "airport_shuttle",
  },
  {
    id: "VH-008",
    name: "Peterbilt 579",
    category: "Semi-Trailer",
    year: 2020,
    licensePlate: "PB-1100-C",
    maxCapacity: 48000,
    odometer: 245000,
    status: "In Shop",
    inService: true,
    icon: "local_shipping",
  },
  {
    id: "VH-009",
    name: "Hino L6 Flatbed",
    category: "Flatbed",
    year: 2021,
    licensePlate: "HN-6644",
    maxCapacity: 25000,
    odometer: 78900,
    status: "Available",
    inService: false,
    icon: "rv_hookup",
  },
  {
    id: "VH-010",
    name: "Thermo King Reefer",
    category: "Refrigerated",
    year: 2023,
    licensePlate: "TK-2200",
    maxCapacity: 18000,
    odometer: 32100,
    status: "On Trip",
    inService: false,
    icon: "ac_unit",
  },
  {
    id: "VH-011",
    name: "Chevrolet Express 3500",
    category: "Cargo Van",
    year: 2021,
    licensePlate: "CV-4455",
    maxCapacity: 3800,
    odometer: 55200,
    status: "Available",
    inService: false,
    icon: "airport_shuttle",
  },
  {
    id: "VH-012",
    name: "Volvo VNL 860",
    category: "Semi-Trailer",
    year: 2024,
    licensePlate: "VV-8800",
    maxCapacity: 50000,
    odometer: 5100,
    status: "On Trip",
    inService: false,
    icon: "local_shipping",
  },
];
