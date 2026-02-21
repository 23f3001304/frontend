/**
 * @module services/DriverService
 * OOP service layer for driver performance & safety backend operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

import type { Driver, DriverDutyStatus } from "../types";

/* ─── DTOs ─── */

/** Payload for creating a new driver. */
export interface CreateDriverDTO {
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  completionRate: number;
  safetyScore: number;
  complaints: number;
  dutyStatus: DriverDutyStatus;
  avatarUrl?: string;
}

/** Payload for updating an existing driver. */
export interface UpdateDriverDTO extends Partial<CreateDriverDTO> {}

/* ─── Service ─── */

class DriverService {
  private static instance: DriverService;

  private constructor() {}

  static getInstance(): DriverService {
    if (!DriverService.instance) {
      DriverService.instance = new DriverService();
    }
    return DriverService.instance;
  }

  /* ─── CRUD ─── */

  /** [TODO] Fetch all drivers from backend. */
  async getDrivers(): Promise<Driver[]> {
    console.log("[DriverService] getDrivers — fetching all drivers");
    return Promise.resolve([]);
  }

  /** [TODO] Fetch a single driver by ID. */
  async getDriverById(id: string): Promise<Driver | null> {
    console.log("[DriverService] getDriverById:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Create a new driver. Returns the created record. */
  async createDriver(data: CreateDriverDTO): Promise<Driver> {
    console.log("[DriverService] createDriver:", data);
    const created: Driver = {
      id: `DR-${Date.now() % 10000}`,
      name: data.name,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      completionRate: data.completionRate,
      safetyScore: data.safetyScore,
      complaints: data.complaints,
      dutyStatus: data.dutyStatus,
      avatarUrl: data.avatarUrl,
    };
    return Promise.resolve(created);
  }

  /** [TODO] Update an existing driver. */
  async updateDriver(id: string, data: UpdateDriverDTO): Promise<Driver | null> {
    console.log("[DriverService] updateDriver:", id, data);
    return Promise.resolve(null);
  }

  /** [TODO] Delete a driver by ID. */
  async deleteDriver(id: string): Promise<boolean> {
    console.log("[DriverService] deleteDriver:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Toggle driver duty status. */
  async toggleDutyStatus(id: string, status: DriverDutyStatus): Promise<boolean> {
    console.log("[DriverService] toggleDutyStatus:", id, "→", status);
    return Promise.resolve(true);
  }

  /** [TODO] Bulk export drivers as CSV. */
  async exportCSV(driverIds: string[]): Promise<Blob> {
    console.log("[DriverService] exportCSV — ids:", driverIds.length);
    return Promise.resolve(
      new Blob(["id,name,license,safetyScore\n"], { type: "text/csv" })
    );
  }
}

export const driverService = DriverService.getInstance();
export default DriverService;
