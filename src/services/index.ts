/**
 * @module services
 * Barrel exports for all OOP backend service classes.
 */

export { fleetService, default as FleetService } from "./FleetService";
export type { CreateVehicleDTO, UpdateVehicleDTO } from "./FleetService";

export { tripService, default as TripService } from "./TripService";
export type { CreateTripDTO, UpdateTripDTO } from "./TripService";

export { maintenanceService, default as MaintenanceService } from "./MaintenanceService";
export type { CreateServiceLogDTO, UpdateServiceLogDTO } from "./MaintenanceService";

export { authService, default as AuthService } from "./AuthService";

export { driverService, default as DriverService } from "./DriverService";
export type { CreateDriverDTO, UpdateDriverDTO } from "./DriverService";

export { reportService, default as ReportService } from "./ReportService";
