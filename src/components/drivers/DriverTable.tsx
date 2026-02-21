/**
 * @module drivers/DriverTable
 * Responsive driver table with desktop rows, mobile cards, and pagination.
 */

import type { Driver } from "../../types";
import { useStaggerRows } from "../../hooks/useGsap";
import DriverRow from "./DriverRow";
import MobileDriverCard from "./MobileDriverCard";
import Pagination from "../Pagination";

interface DriverTableProps {
  /** Paginated drivers to display. */
  drivers: Driver[];
  /** Total number of filtered drivers (for pagination count). */
  totalResults: number;
  /** Current page number. */
  currentPage: number;
  /** Rows per page. */
  pageSize: number;
  /** Callback to change page. */
  onPageChange: (page: number) => void;
  /** Callback to toggle duty status for a driver. */
  onToggleDuty: (id: string) => void;
}

/** Responsive driver table with pagination. */
export default function DriverTable({
  drivers,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
  onToggleDuty,
}: DriverTableProps) {
  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([currentPage, drivers.length], "tr");
  const mobileRef = useStaggerRows<HTMLDivElement>([currentPage, drivers.length], ":scope > *");

  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden">

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[
                "Driver Name",
                "License #",
                "Expiry",
                "Completion Rate",
                "Safety Score",
                "Complaints",
                "Duty Status",
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
            {drivers.map((d, idx) => (
              <DriverRow
                key={d.id}
                driver={d}
                onToggleDuty={() => onToggleDuty(d.id)}
                isNearBottom={idx >= drivers.length - 2}
              />
            ))}
            {drivers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark"
                >
                  No drivers match your filters.
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
        {drivers.map((d, idx) => (
          <MobileDriverCard
            key={d.id}
            driver={d}
            onToggleDuty={() => onToggleDuty(d.id)}
            isNearBottom={idx >= drivers.length - 2}
          />
        ))}
        {drivers.length === 0 && (
          <div className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark">
            No drivers match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        total={totalResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        label="results"
      />
    </div>
  );
}
