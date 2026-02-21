/**
 * @module services/TripService
 * OOP service layer for trip dispatch / management backend operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

import type { Trip, TripStatus } from "../types";

/* ─── DTOs ─── */

/** Payload for creating a new trip. */
export interface CreateTripDTO {
  vehicleId: string;
  driverId: string;
  originName: string;
  originLat: number;
  originLon: number;
  destinationName: string;
  destinationLat: number;
  destinationLon: number;
  cargoWeightKg: number;
  distanceKm: number;
  durationMin: number;
  fuelCost: number;
}

/** Payload for updating a trip. */
export interface UpdateTripDTO {
  status?: TripStatus;
  driverId?: string;
  eta?: string;
}

/* ─── Service ─── */

class TripService {
  private static instance: TripService;

  private constructor() {}

  static getInstance(): TripService {
    if (!TripService.instance) {
      TripService.instance = new TripService();
    }
    return TripService.instance;
  }

  /* ─── CRUD ─── */

  /** [TODO] Fetch all trips from backend. */
  async getTrips(): Promise<Trip[]> {
    console.log("[TripService] getTrips — fetching all trips");
    return Promise.resolve([]);
  }

  /** [TODO] Fetch a single trip by ID. */
  async getTripById(id: string): Promise<Trip | null> {
    console.log("[TripService] getTripById:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Create and dispatch a new trip. Returns the trip record. */
  async createTrip(data: CreateTripDTO): Promise<Trip> {
    console.log("[TripService] createTrip:", data);
    const created: Trip = {
      id: `#TR-${Date.now()}`,
      vehicle: { name: "Pending", licensePlate: "—" },
      driver: { name: "Pending" },
      route: { from: data.originName, to: data.destinationName },
      eta: `${Math.round(data.durationMin / 60)}h ${data.durationMin % 60}m`,
      status: "Ready",
    };
    return Promise.resolve(created);
  }

  /** [TODO] Save a trip as draft (not dispatched). */
  async saveDraft(data: CreateTripDTO): Promise<Trip> {
    console.log("[TripService] saveDraft:", data);
    return this.createTrip(data);
  }

  /** [TODO] Dispatch (activate) a draft trip. */
  async dispatchTrip(id: string): Promise<Trip | null> {
    console.log("[TripService] dispatchTrip:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Update trip status or reassign driver. */
  async updateTrip(id: string, data: UpdateTripDTO): Promise<Trip | null> {
    console.log("[TripService] updateTrip:", id, data);
    return Promise.resolve(null);
  }

  /** [TODO] Cancel a trip. */
  async cancelTrip(id: string): Promise<boolean> {
    console.log("[TripService] cancelTrip:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Assign a driver to a trip. */
  async assignDriver(tripId: string, driverId: string): Promise<Trip | null> {
    console.log("[TripService] assignDriver:", tripId, "→", driverId);
    return Promise.resolve(null);
  }

  /* ─── Export ─── */

  /** [TODO] Export trips as CSV and return a downloadable Blob. */
  async exportCSV(tripIds: string[]): Promise<Blob> {
    console.log("[TripService] exportCSV — ids:", tripIds.length);
    const csv = "id,vehicle,driver,from,to,eta,status\n";
    return Promise.resolve(new Blob([csv], { type: "text/csv" }));
  }
}

export const tripService = TripService.getInstance();
export default TripService;
