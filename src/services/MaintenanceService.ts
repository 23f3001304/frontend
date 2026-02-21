/**
 * @module services/MaintenanceService
 * OOP service layer for maintenance / service log backend operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

import type { ServiceLog, ServiceStatus } from "../components/maintenance/constants";

/* ─── DTOs ─── */

/** Payload for creating a new service log. */
export interface CreateServiceLogDTO {
  vehicleName: string;
  vehicleLicensePlate: string;
  vehicleIcon: string;
  issue: string;
  serviceType: string;
  date: string;
  cost: number;
  status: ServiceStatus;
}

/** Payload for updating a service log. */
export interface UpdateServiceLogDTO extends Partial<CreateServiceLogDTO> {}

/* ─── Service ─── */

class MaintenanceService {
  private static instance: MaintenanceService;

  private constructor() {}

  static getInstance(): MaintenanceService {
    if (!MaintenanceService.instance) {
      MaintenanceService.instance = new MaintenanceService();
    }
    return MaintenanceService.instance;
  }

  /* ─── CRUD ─── */

  /** [TODO] Fetch all service logs from backend. */
  async getServiceLogs(): Promise<ServiceLog[]> {
    console.log("[MaintenanceService] getServiceLogs — fetching all logs");
    return Promise.resolve([]);
  }

  /** [TODO] Fetch a single service log by ID. */
  async getServiceLogById(id: string): Promise<ServiceLog | null> {
    console.log("[MaintenanceService] getServiceLogById:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Create a new service log. Returns the created record. */
  async createServiceLog(data: CreateServiceLogDTO): Promise<ServiceLog> {
    console.log("[MaintenanceService] createServiceLog:", data);
    const created: ServiceLog = {
      id: `#${Date.now() % 10000}`,
      vehicle: {
        name: data.vehicleName,
        licensePlate: data.vehicleLicensePlate,
        icon: data.vehicleIcon,
      },
      issue: data.issue,
      serviceType: data.serviceType,
      date: data.date,
      cost: data.cost,
      status: data.status,
    };
    return Promise.resolve(created);
  }

  /** [TODO] Update an existing service log. */
  async updateServiceLog(id: string, data: UpdateServiceLogDTO): Promise<ServiceLog | null> {
    console.log("[MaintenanceService] updateServiceLog:", id, data);
    return Promise.resolve(null);
  }

  /** [TODO] Delete a service log by ID. */
  async deleteServiceLog(id: string): Promise<boolean> {
    console.log("[MaintenanceService] deleteServiceLog:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Print / generate PDF report for a service log. */
  async printReport(id: string): Promise<Blob> {
    console.log("[MaintenanceService] printReport:", id);
    return Promise.resolve(new Blob(["report"], { type: "application/pdf" }));
  }

  /** [TODO] Bulk export service logs as CSV. */
  async exportCSV(logIds: string[]): Promise<Blob> {
    console.log("[MaintenanceService] exportCSV — ids:", logIds.length);
    const csv = "id,vehicle,issue,date,cost,status\n";
    return Promise.resolve(new Blob([csv], { type: "text/csv" }));
  }
}

export const maintenanceService = MaintenanceService.getInstance();
export default MaintenanceService;
