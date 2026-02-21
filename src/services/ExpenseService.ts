/**
 * @module services/ExpenseService
 * OOP service layer for trip expense & fuel logging backend operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

import type { TripExpense, ExpenseStatus } from "../types";

/* ─── DTOs ─── */

/** Payload for creating a new expense record. */
export interface CreateExpenseDTO {
  driverName: string;
  driverInitials: string;
  driverAvatarColor: string;
  vehicle: string;
  distance: number;
  fuelExpense: number;
  miscExpense: number;
  status?: ExpenseStatus;
}

/** Payload for updating an existing expense record. */
export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  status?: ExpenseStatus;
}

/* ─── Service ─── */

class ExpenseService {
  private static instance: ExpenseService;

  private constructor() {}

  static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }
    return ExpenseService.instance;
  }

  /* ─── CRUD ─── */

  /** [TODO] Fetch all expense records from backend. */
  async getExpenses(): Promise<TripExpense[]> {
    console.log("[ExpenseService] getExpenses — fetching all expenses");
    return Promise.resolve([]);
  }

  /** [TODO] Fetch a single expense by ID. */
  async getExpenseById(id: string): Promise<TripExpense | null> {
    console.log("[ExpenseService] getExpenseById:", id);
    return Promise.resolve(null);
  }

  /** [TODO] Create a new expense record. Returns the created record. */
  async createExpense(data: CreateExpenseDTO): Promise<TripExpense> {
    console.log("[ExpenseService] createExpense:", data);
    const created: TripExpense = {
      id: `#TR-${Date.now() % 10000}`,
      driver: {
        name: data.driverName,
        initials: data.driverInitials,
        avatarColor: data.driverAvatarColor,
      },
      vehicle: data.vehicle,
      distance: data.distance,
      fuelExpense: data.fuelExpense,
      miscExpense: data.miscExpense,
      totalCost: data.fuelExpense + data.miscExpense,
      status: data.status ?? "Pending",
    };
    return Promise.resolve(created);
  }

  /** [TODO] Update an existing expense record. */
  async updateExpense(id: string, data: UpdateExpenseDTO): Promise<TripExpense | null> {
    console.log("[ExpenseService] updateExpense:", id, data);
    return Promise.resolve(null);
  }

  /** [TODO] Delete an expense record by ID. */
  async deleteExpense(id: string): Promise<boolean> {
    console.log("[ExpenseService] deleteExpense:", id);
    return Promise.resolve(true);
  }

  /** [TODO] Approve or reject an expense. */
  async updateStatus(id: string, status: ExpenseStatus): Promise<boolean> {
    console.log("[ExpenseService] updateStatus:", id, "→", status);
    return Promise.resolve(true);
  }

  /** [TODO] Bulk export expenses as CSV. */
  async exportCSV(expenseIds: string[]): Promise<Blob> {
    console.log("[ExpenseService] exportCSV — ids:", expenseIds.length);
    return Promise.resolve(
      new Blob(["id,driver,vehicle,distance,fuelExpense,miscExpense,totalCost,status\n"], { type: "text/csv" })
    );
  }
}

export const expenseService = ExpenseService.getInstance();
export default ExpenseService;
