/**
 * @module services/FleetService
 * OOP service layer for fleet/vehicle backend operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

import type { Vehicle, VehicleCategory, VehicleStatus } from "../types";

/* ─── DTOs ─── */

/** Payload for creating a new vehicle. */
export interface CreateVehicleDTO {
  name: string;
  category: VehicleCategory;
  year: number;
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  icon: string;
}

/** Payload for updating an existing vehicle. */
export interface UpdateVehicleDTO extends Partial<CreateVehicleDTO> {
  status?: VehicleStatus;
  inService?: boolean;
}

/* ─── Service ─── */

class FleetService {
  private static instance: FleetService;

  private constructor() {}

  static getInstance(): FleetService {
    if (!FleetService.instance) {
      FleetService.instance = new FleetService();
    }
    return FleetService.instance;
  }

  /* ─── CRUD ─── */

  /** [TODO] Fetch all vehicles from backend. */
  async getVehicles(): Promise<Vehicle[]> {
    console.log("[FleetService] getVehicles — fetching all vehicles");
    // TODO: return axios.get("/api/vehicles").then(r => r.data);
    return Promise.resolve([]);
  }

  /** [TODO] Fetch a single vehicle by ID. */
  async getVehicleById(id: string): Promise<Vehicle | null> {
    console.log("[FleetService] getVehicleById:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Create a new vehicle. Returns the created vehicle. */
  async createVehicle(data: CreateVehicleDTO): Promise<Vehicle> {
    console.log("[FleetService] createVehicle:", data);
    // Simulate created record
    const created: Vehicle = {
      id: `VH-${Date.now()}`,
      name: data.name,
      category: data.category,
      year: data.year,
      licensePlate: data.licensePlate,
      maxCapacity: data.maxCapacity,
      odometer: data.odometer,
      status: "Available",
      inService: false,
      icon: data.icon,
    };
    return Promise.resolve(created);
  }

  /** [TODO] Update an existing vehicle. */
  async updateVehicle(id: string, data: UpdateVehicleDTO): Promise<Vehicle | null> {
    console.log("[FleetService] updateVehicle:", id, data);
    return Promise.resolve(null);
  }

  /** [TODO] Delete a vehicle by ID. */
  async deleteVehicle(id: string): Promise<boolean> {
    console.log("[FleetService] deleteVehicle:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Retire / decommission a vehicle. */
  async retireVehicle(id: string): Promise<boolean> {
    console.log("[FleetService] retireVehicle:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Schedule a service appointment for a vehicle. */
  async scheduleService(id: string): Promise<boolean> {
    console.log("[FleetService] scheduleService:", id);
    return Promise.resolve(true);
  }

  /* ─── Service Toggle ─── */

  /** [TODO] Toggle the service/maintenance flag on a vehicle. */
  async toggleService(id: string, inService: boolean): Promise<boolean> {
    console.log("[FleetService] toggleService:", id, "→", inService);
    return Promise.resolve(true);
  }

  /* ─── Export ─── */

  /** [TODO] Export vehicles as CSV and trigger download. */
  async exportCSV(vehicleIds: string[]): Promise<Blob> {
    console.log("[FleetService] exportCSV — ids:", vehicleIds.length);
    const csv = "id,name,category,year,licensePlate\n";
    return Promise.resolve(new Blob([csv], { type: "text/csv" }));
  }
}

export const fleetService = FleetService.getInstance();
export default FleetService;
