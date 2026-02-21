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
  Driver,
  TripExpense,
  VehicleAnalyticsEntry,
  FleetROI,
  FuelEfficiencyDataPoint,
} from "./types";

/** Primary sidebar navigation items. The `active` flag marks the default page. */
export const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: true, requiredPermission: "dashboard:view" },
  { icon: "directions_car", label: "Vehicle Registry", href: "/vehicles", requiredPermission: "vehicles:view" },
  { icon: "map", label: "All Trips", href: "/trips", requiredPermission: "trips:view" },
  { icon: "alt_route", label: "Trip Dispatcher", href: "/dispatcher", requiredPermission: "dispatcher:view" },
  { icon: "build", label: "Maintenance", href: "/maintenance", requiredPermission: "maintenance:view" },
  { icon: "receipt_long", label: "Trip & Expense", href: "/expenses", requiredPermission: "expenses:view" },
  { icon: "verified_user", label: "Performance", href: "/performance", requiredPermission: "drivers:view" },
  { icon: "analytics", label: "Analytics", href: "/analytics", requiredPermission: "analytics:view" },
];

/** Signed-in user displayed in the sidebar profile area. */
export const currentUser: UserProfile = {
  name: "Alex Morgan",
  role: "Fleet Manager",
  userRole: "fleet_manager",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCk35KUeasH1IS5wWE63QoD1FWPHnvbLp3RafhgDBLBJ9GdLsFgOsWJvJNBY6bJTU9aLOKGS3iV9GTH0Ikx1vU8Fwu5B18gzJ47Ffr_NXvSQ-E7Gj6FR9ddD5roE_2iRzRmr7eBwGJm5eHHFU5GP6sV5JMlvx8-yDCQ5yinqTV_Vjo21F8B2ttwygU-DKkByB-2NA66z6EntxnE1nUkala8NmqNspAzZI73dX0fhjDy0l4151zYk15pX_Nq08z-3xNxCZjPZTOmaw",
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

/* ─────────────────────────────────────────────
 *  DRIVER PERFORMANCE
 * ───────────────────────────────────────────── */

/** Seed driver records for the Performance page. */
export const drivers: Driver[] = [
  {
    id: "DR-1045",
    name: "John Smith",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBHdvbnzhqIhsEpl7aV26nyvdF6aK7ZoosYERYGdiIyN0M5ZS02Z1NlyeqvxUWweclCv3PN1-9zfxdxpIB_tQiVkMTCRXfo9hRJlrh6s7dvxPTTzMePTXOhnJ-02LrcYvNnzifb-80HsHGNKQ6DX560MRzIVDZyAbJbhF7UJQtnVnLsvBJj4rEV8zu5T4rLgDoUN4KW7OK6nEs99n53_a2eKalz3ncRn5e9chaQYbalxmsxiJrt-jJAvgBOXGujca2PGAoLPbM1A",
    licenseNumber: "DL-23223",
    licenseExpiry: "22 Dec 2036",
    completionRate: 98,
    safetyScore: 89,
    complaints: 4,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1082",
    name: "Michael Chen",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    licenseNumber: "DL-89421",
    licenseExpiry: "15 Days Left",
    licenseExpiryDays: 15,
    completionRate: 92,
    safetyScore: 94,
    complaints: 1,
    dutyStatus: "Off Duty",
  },
  {
    id: "DR-1102",
    name: "Sarah Connor",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    licenseNumber: "DL-12849",
    licenseExpiry: "14 Jan 2030",
    completionRate: 100,
    safetyScore: 78,
    complaints: 0,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1120",
    name: "Robert Fox",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk35KUeasH1IS5wWE63QoD1FWPHnvbLp3RafhgDBLBJ9GdLsFgOsWJvJNBY6bJTU9aLOKGS3iV9GTH0Ikx1vU8Fwu5B18gzJ47Ffr_NXvSQ-E7Gj6FR9ddD5roE_2iRzRmr7eBwGJm5eHHFU5GP6sV5JMlvx8-yDCQ5yinqTV_Vjo21F8B2ttwygU-DKkByB-2NA66z6EntxnE1nUkala8NmqNspAzZI73dX0fhjDy0l4151zYk15pX_Nq08z-3xNxCZjPZTOmaw",
    licenseNumber: "DL-55291",
    licenseExpiry: "01 Nov 2028",
    completionRate: 65,
    safetyScore: 45,
    complaints: 12,
    dutyStatus: "Suspended",
  },
  {
    id: "DR-1156",
    name: "Dave Wilson",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBHdvbnzhqIhsEpl7aV26nyvdF6aK7ZoosYERYGdiIyN0M5ZS02Z1NlyeqvxUWweclCv3PN1-9zfxdxpIB_tQiVkMTCRXfo9hRJlrh6s7dvxPTTzMePTXOhnJ-02LrcYvNnzifb-80HsHGNKQ6DX560MRzIVDZyAbJbhF7UJQtnVnLsvBJj4rEV8zu5T4rLgDoUN4KW7OK6nEs99n53_a2eKalz3ncRn5e9chaQYbalxmsxiJrt-jJAvgBOXGujca2PGAoLPbM1A",
    licenseNumber: "DL-99321",
    licenseExpiry: "10 Oct 2032",
    completionRate: 95,
    safetyScore: 98,
    complaints: 0,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1200",
    name: "Raj Patel",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    licenseNumber: "DL-44120",
    licenseExpiry: "08 Mar 2029",
    completionRate: 88,
    safetyScore: 82,
    complaints: 3,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1215",
    name: "Anita Sharma",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    licenseNumber: "DL-78210",
    licenseExpiry: "25 Jun 2031",
    completionRate: 97,
    safetyScore: 91,
    complaints: 0,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1230",
    name: "Vikram Singh",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk35KUeasH1IS5wWE63QoD1FWPHnvbLp3RafhgDBLBJ9GdLsFgOsWJvJNBY6bJTU9aLOKGS3iV9GTH0Ikx1vU8Fwu5B18gzJ47Ffr_NXvSQ-E7Gj6FR9ddD5roE_2iRzRmr7eBwGJm5eHHFU5GP6sV5JMlvx8-yDCQ5yinqTV_Vjo21F8B2ttwygU-DKkByB-2NA66z6EntxnE1nUkala8NmqNspAzZI73dX0fhjDy0l4151zYk15pX_Nq08z-3xNxCZjPZTOmaw",
    licenseNumber: "DL-33456",
    licenseExpiry: "20 Days Left",
    licenseExpiryDays: 20,
    completionRate: 74,
    safetyScore: 62,
    complaints: 7,
    dutyStatus: "Off Duty",
  },
  {
    id: "DR-1248",
    name: "Priya Verma",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    licenseNumber: "DL-19845",
    licenseExpiry: "17 Sep 2034",
    completionRate: 100,
    safetyScore: 96,
    complaints: 1,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1260",
    name: "Suresh Kumar",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCu0mo0qB93KRb-kavrB1UD4qcQhKXtAGlek3xREAr5lToS_onbRIvaa2wU4NBQd9eeQq5OHjdHuWgFvxODddeZEuzvRD7YmCKPn7NDYw3rmXAo_auTnw1yJzqAMYVEUjFM1f5mgLKpKfirPQMMujgckZmtjCNlzfkWf3ZjKyd1YxDZgD_fPARrUpqguG2gY19__epC_8rY7Amj_jZBNEAQegSX8Vu8IPHsARxVLcOXmYiZ_ce9ohGZs7xZ78A-DaIFp26LI2jRJQ",
    licenseNumber: "DL-67890",
    licenseExpiry: "05 Feb 2027",
    completionRate: 85,
    safetyScore: 77,
    complaints: 5,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1275",
    name: "Deepak Joshi",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk35KUeasH1IS5wWE63QoD1FWPHnvbLp3RafhgDBLBJ9GdLsFgOsWJvJNBY6bJTU9aLOKGS3iV9GTH0Ikx1vU8Fwu5B18gzJ47Ffr_NXvSQ-E7Gj6FR9ddD5roE_2iRzRmr7eBwGJm5eHHFU5GP6sV5JMlvx8-yDCQ5yinqTV_Vjo21F8B2ttwygU-DKkByB-2NA66z6EntxnE1nUkala8NmqNspAzZI73dX0fhjDy0l4151zYk15pX_Nq08z-3xNxCZjPZTOmaw",
    licenseNumber: "DL-54321",
    licenseExpiry: "12 Aug 2033",
    completionRate: 91,
    safetyScore: 88,
    complaints: 2,
    dutyStatus: "On Duty",
  },
  {
    id: "DR-1290",
    name: "Lisa Thompson",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFRKygNCPdwKTOwvVF5IRkHbKDoLkppcMkyNknodZv-tkJdNtJHsLkmVYCHaVDurQFUY549Iy5PzUR7MF3tRG21YvNbKJPMxt5MZ53k9uLllg8Dx91TLSRE8BnY-EnfXnnwdch5V4jPDjIVcqZzDd5SyMG2Qz8XNfH-yTXPIbUeSIKkxQ-B0a2PjOLFsVhDceObVYrFgiWWYppXcmxc0pYlKj7mWXJbDn4-VXCzSOwdYAt3CZyl8M0hbPEbBAZ4o_AJf_JZdwUbg",
    licenseNumber: "DL-11223",
    licenseExpiry: "30 Apr 2035",
    completionRate: 99,
    safetyScore: 95,
    complaints: 0,
    dutyStatus: "On Duty",
  },
];

/** Simulated total driver count (as if backed by an API with more records). */
export const TOTAL_DRIVERS = 48;

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

/* ─────────────────────────────────────────────
 *  TRIP & EXPENSE
 * ───────────────────────────────────────────── */

/** Seed trip expense records for the Expense & Fuel Logging page. */
export const tripExpenses: TripExpense[] = [
  {
    id: "#TR-321",
    driver: { name: "John Doe", initials: "JD", avatarColor: "bg-gray-400" },
    vehicle: "Volvo FH16",
    distance: 1000,
    fuelExpense: 19000,
    miscExpense: 3000,
    totalCost: 22000,
    status: "Approved",
  },
  {
    id: "#TR-322",
    driver: { name: "Mike Smith", initials: "MS", avatarColor: "bg-blue-500" },
    vehicle: "Scania R450",
    distance: 850,
    fuelExpense: 15200,
    miscExpense: 1200,
    totalCost: 16400,
    status: "Pending",
  },
  {
    id: "#TR-323",
    driver: { name: "Sarah Lee", initials: "AL", avatarColor: "bg-pink-400" },
    vehicle: "Tata Prima",
    distance: 2300,
    fuelExpense: 41500,
    miscExpense: 500,
    totalCost: 42000,
    status: "Approved",
  },
  {
    id: "#TR-324",
    driver: { name: "Raj Patel", initials: "RJ", avatarColor: "bg-purple-400" },
    vehicle: "Ashok Leyland",
    distance: 500,
    fuelExpense: 9800,
    miscExpense: 0,
    totalCost: 9800,
    status: "Rejected",
  },
  {
    id: "#TR-325",
    driver: { name: "Anita Sharma", initials: "AS", avatarColor: "bg-teal-400" },
    vehicle: "BharatBenz 1617",
    distance: 1200,
    fuelExpense: 22400,
    miscExpense: 1800,
    totalCost: 24200,
    status: "Approved",
  },
  {
    id: "#TR-326",
    driver: { name: "Vikram Singh", initials: "VS", avatarColor: "bg-orange-400" },
    vehicle: "Eicher Pro",
    distance: 680,
    fuelExpense: 12500,
    miscExpense: 600,
    totalCost: 13100,
    status: "Pending",
  },
  {
    id: "#TR-327",
    driver: { name: "Priya Verma", initials: "PV", avatarColor: "bg-indigo-400" },
    vehicle: "Mahindra Blazo",
    distance: 1550,
    fuelExpense: 28000,
    miscExpense: 2400,
    totalCost: 30400,
    status: "Approved",
  },
  {
    id: "#TR-328",
    driver: { name: "Suresh Kumar", initials: "SK", avatarColor: "bg-emerald-500" },
    vehicle: "Volvo FM 380",
    distance: 920,
    fuelExpense: 17200,
    miscExpense: 900,
    totalCost: 18100,
    status: "Pending",
  },
  {
    id: "#TR-329",
    driver: { name: "Deepak Joshi", initials: "DJ", avatarColor: "bg-rose-400" },
    vehicle: "Tata Signa",
    distance: 1400,
    fuelExpense: 25600,
    miscExpense: 3200,
    totalCost: 28800,
    status: "Approved",
  },
  {
    id: "#TR-330",
    driver: { name: "Lisa Thompson", initials: "LT", avatarColor: "bg-cyan-400" },
    vehicle: "Ford Transit 350",
    distance: 350,
    fuelExpense: 6400,
    miscExpense: 200,
    totalCost: 6600,
    status: "Approved",
  },
  {
    id: "#TR-331",
    driver: { name: "Michael Chen", initials: "MC", avatarColor: "bg-amber-500" },
    vehicle: "Kenworth T680",
    distance: 2100,
    fuelExpense: 38500,
    miscExpense: 4200,
    totalCost: 42700,
    status: "Pending",
  },
  {
    id: "#TR-332",
    driver: { name: "Sarah Connor", initials: "SC", avatarColor: "bg-lime-500" },
    vehicle: "Peterbilt 579",
    distance: 760,
    fuelExpense: 14100,
    miscExpense: 0,
    totalCost: 14100,
    status: "Rejected",
  },
];

/** Simulated total expense record count (as if backed by an API). */
export const TOTAL_EXPENSES = 42;

/* ─────────────────────────────────────────────
 *  OPERATIONAL ANALYTICS
 * ───────────────────────────────────────────── */

/** Daily fuel efficiency data (Oct 1–31, 2023). */
export const fuelEfficiencyData: FuelEfficiencyDataPoint[] = [
  { label: "Oct 01", value: 58 },
  { label: "Oct 02", value: 62 },
  { label: "Oct 03", value: 55 },
  { label: "Oct 04", value: 60 },
  { label: "Oct 05", value: 64 },
  { label: "Oct 06", value: 58 },
  { label: "Oct 07", value: 56 },
  { label: "Oct 08", value: 61 },
  { label: "Oct 09", value: 59 },
  { label: "Oct 10", value: 63 },
  { label: "Oct 11", value: 60 },
  { label: "Oct 12", value: 65 },
  { label: "Oct 13", value: 62 },
  { label: "Oct 14", value: 58 },
  { label: "Oct 15", value: 70 },
  { label: "Oct 16", value: 68 },
  { label: "Oct 17", value: 72 },
  { label: "Oct 18", value: 75 },
  { label: "Oct 19", value: 65 },
  { label: "Oct 20", value: 80 },
  { label: "Oct 21", value: 78 },
  { label: "Oct 22", value: 82 },
  { label: "Oct 23", value: 76 },
  { label: "Oct 24", value: 72 },
  { label: "Oct 25", value: 85 },
  { label: "Oct 26", value: 80 },
  { label: "Oct 27", value: 78 },
  { label: "Oct 28", value: 74 },
  { label: "Oct 29", value: 70 },
  { label: "Oct 30", value: 68 },
  { label: "Oct 31", value: 82 },
];

/** Fleet ROI breakdown data for the analysis panel. */
export const fleetROIData: FleetROI[] = [
  { label: "Fleet A (Heavy Duty)", margin: 82, rev: "$42K", cost: "$7.5K" },
  { label: "Fleet B (Mid Range)", margin: 65, rev: "$28K", cost: "$9.8K" },
  { label: "Fleet C (Last Mile)", margin: 48, rev: "$15K", cost: "$7.8K" },
];

/** Transaction & Performance Log entries. */
export const vehicleAnalytics: VehicleAnalyticsEntry[] = [
  { vehicleId: "TRK-2049", status: "Optimal", fuelEfficiency: 14.2, opCost: 1240, revenue: 8400 },
  { vehicleId: "VAN-8812", status: "Review", fuelEfficiency: 9.1, opCost: 2100, revenue: 4200 },
  { vehicleId: "TRK-1090", status: "Optimal", fuelEfficiency: 12.8, opCost: 980, revenue: 11200 },
  { vehicleId: "SUV-4401", status: "Critical", fuelEfficiency: 6.4, opCost: 4450, revenue: 5100 },
  { vehicleId: "TRK-3301", status: "Optimal", fuelEfficiency: 13.5, opCost: 1100, revenue: 9800 },
  { vehicleId: "VAN-6654", status: "Review", fuelEfficiency: 8.7, opCost: 2400, revenue: 3900 },
  { vehicleId: "TRK-7720", status: "Optimal", fuelEfficiency: 15.1, opCost: 870, revenue: 10500 },
  { vehicleId: "SUV-9983", status: "Critical", fuelEfficiency: 5.9, opCost: 5200, revenue: 4800 },
  { vehicleId: "TRK-4455", status: "Optimal", fuelEfficiency: 14.8, opCost: 1050, revenue: 9200 },
  { vehicleId: "VAN-2211", status: "Review", fuelEfficiency: 10.2, opCost: 1800, revenue: 5600 },
  { vehicleId: "TRK-8867", status: "Optimal", fuelEfficiency: 13.9, opCost: 920, revenue: 8900 },
  { vehicleId: "SUV-1133", status: "Critical", fuelEfficiency: 7.1, opCost: 3800, revenue: 5400 },
];

/** Simulated total vehicle count for analytics log pagination. */
export const TOTAL_ANALYTICS_VEHICLES = 124;
