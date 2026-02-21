/**
 * @module analytics/TransactionLogTable
 * Transaction & Performance Log table with local search and pagination.
 *
 * Desktop: full table with 6 columns.
 * Mobile: stacked card layout with Prev/Next pagination.
 */

import { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { useStaggerRows } from "../../hooks/useGsap";
import Pagination from "../Pagination";
import TransactionLogRow from "./TransactionLogRow";
import MobileTransactionCard from "./MobileTransactionCard";
import type { VehicleAnalyticsEntry } from "../../types";

interface TransactionLogTableProps {
  entries: VehicleAnalyticsEntry[];
  totalResults: number;
  pageSize: number;
  /** Externally-driven search query. */
  searchQuery?: string;
}

export default function TransactionLogTable({
  entries,
  totalResults,
  pageSize,
  searchQuery = "",
}: TransactionLogTableProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine external + local search
  const effectiveSearch = (localSearch || searchQuery).toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!effectiveSearch) return entries;
    return entries.filter((e) =>
      e.vehicleId.toLowerCase().includes(effectiveSearch),
    );
  }, [entries, effectiveSearch]);

  // Reset page on search change
  useEffect(() => { setCurrentPage(1); }, [effectiveSearch]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([paginated]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current!, {
        opacity: 0,
        y: 14,
        duration: 0.3,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
          Transaction &amp; Performance Log
        </h3>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">
              search
            </span>
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search vehicle ID..."
            className="block w-full pl-9 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 text-text-muted-light dark:text-text-muted-dark text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-semibold">Vehicle ID</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Fuel Efficiency</th>
              <th className="px-4 py-3 text-left font-semibold">Op. Cost</th>
              <th className="px-4 py-3 text-left font-semibold">Revenue</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {paginated.map((entry) => (
              <TransactionLogRow key={entry.vehicleId} entry={entry} />
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted-light dark:text-text-muted-dark text-sm">
                  No vehicles match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3 px-4 pb-4">
        {paginated.map((entry) => (
          <MobileTransactionCard key={entry.vehicleId} entry={entry} />
        ))}
        {paginated.length === 0 && (
          <p className="text-center py-8 text-text-muted-light dark:text-text-muted-dark text-sm">
            No vehicles match your search.
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        total={filtered.length > 0 ? totalResults : filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        label="vehicles"
      />
    </div>
  );
}
