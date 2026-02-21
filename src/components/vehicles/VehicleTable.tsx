/**
 * @module vehicles/VehicleTable
 * Responsive vehicle table with desktop rows, mobile cards, and pagination.
 */

import type { Vehicle } from "../../types";
import { useStaggerRows } from "../../hooks/useGsap";
import VehicleRow from "./VehicleRow";
import MobileVehicleCard from "./MobileVehicleCard";
import Pagination from "../Pagination";

interface VehicleTableProps {
  /** Paginated vehicles to display. */
  vehicles: Vehicle[];
  /** Total number of filtered vehicles (for pagination count). */
  totalResults: number;
  /** Current page number. */
  currentPage: number;
  /** Rows per page. */
  pageSize: number;
  /** Callback to change page. */
  onPageChange: (page: number) => void;
  /** Service mode state keyed by vehicle id. */
  serviceState: Record<string, boolean>;
  /** Toggle service mode for a vehicle. */
  onToggleService: (id: string) => void;
}

/** Responsive vehicle table with pagination. */
export default function VehicleTable({
  vehicles,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
  serviceState,
  onToggleService,
}: VehicleTableProps) {
  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([currentPage, vehicles.length], "tr");
  const mobileRef = useStaggerRows<HTMLDivElement>([currentPage, vehicles.length], ":scope > *");

  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden">

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[
                "Vehicle Name / Model",
                "License Plate",
                "Max Capacity",
                "Odometer",
                "Status",
                "Service Toggle",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            ref={tbodyRef}
            className="divide-y divide-border-light dark:divide-border-dark"
          >
            {vehicles.map((v, idx) => (
              <VehicleRow
                key={v.id}
                vehicle={v}
                inService={serviceState[v.id] ?? v.inService}
                onToggle={() => onToggleService(v.id)}
                isNearBottom={idx >= vehicles.length - 2}
              />
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark"
                >
                  No vehicles match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div
        ref={mobileRef}
        className="md:hidden divide-y divide-border-light dark:divide-border-dark"
      >
        {vehicles.map((v, idx) => (
          <MobileVehicleCard
            key={v.id}
            vehicle={v}
            inService={serviceState[v.id] ?? v.inService}
            onToggle={() => onToggleService(v.id)}
            isNearBottom={idx >= vehicles.length - 2}
          />
        ))}
        {vehicles.length === 0 && (
          <div className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark">
            No vehicles match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        total={totalResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        label="vehicles"
      />
    </div>
  );
}
