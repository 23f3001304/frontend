/**
 * @module TripExpense
 * Expense & Fuel Logging page.
 *
 * Features:
 *  - Title bar with Export and "+ Add an Expense" buttons.
 *  - Search by Trip ID, Driver, or Vehicle.
 *  - Filter, Sort by, Group by toolbar dropdowns.
 *  - Three outlined summary cards (Total Fuel Cost, Avg Cost/km, Pending Approvals).
 *  - Desktop table + mobile card layout with pagination.
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn } from "../lib/animations";
import { tripExpenses } from "../data";
import {
  ExpenseTable,
  SummaryCards,
  NewExpenseModal,
} from "../components/expenses";
import type {
  ExpenseFilterByOption,
  ExpenseSortByOption,
  ExpenseGroupByOption,
} from "../components/expenses";
import { formatCurrency } from "../components/expenses/constants";
import { expenseService } from "../services";
import { downloadBlob } from "../lib/download";

/* ─── Props ─── */

interface TripExpenseProps {
  /** Global search query from the header. */
  searchQuery: string;
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/* ─── Derived summary data ─── */

function buildSummaryCards() {
  const totalFuel = tripExpenses.reduce((sum, e) => sum + e.fuelExpense, 0);
  const totalDistance = tripExpenses.reduce((sum, e) => sum + e.distance, 0);
  const avgPerKm = totalDistance > 0 ? totalFuel / totalDistance : 0;
  const pendingCount = tripExpenses.filter((e) => e.status === "Pending").length;

  return [
    { label: "Total Fuel Cost (This Month)", value: formatCurrency(totalFuel) },
    { label: "Avg. Cost per km", value: `$${avgPerKm.toFixed(2)}` },
    { label: "Pending Approvals", value: String(pendingCount) },
  ];
}

/* ─── Page ─── */

export default function TripExpense({ searchQuery, pageSize }: TripExpenseProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [filterBy, setFilterBy] = useState<ExpenseFilterByOption>("All Statuses");
  const [sortBy, setSortBy] = useState<ExpenseSortByOption>("Date (Newest)");
  const [groupBy, setGroupBy] = useState<ExpenseGroupByOption>("None");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown open states
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  // Modal
  const [showAddExpense, setShowAddExpense] = useState(false);

  const pop = useClickPop();
  const titleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (toolbarRef.current) fadeSlideIn(toolbarRef.current, "up", { duration: 0.25, delay: 0.08 });
    });
    return () => ctx.revert();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setGroupOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Combine local + global search
  const effectiveSearch = (localSearch || searchQuery || "").toLowerCase().trim();

  // Filter + sort logic
  const filtered = useMemo(() => {
    let list = [...tripExpenses];

    // Status filter
    if (filterBy !== "All Statuses") {
      list = list.filter((e) => e.status === filterBy);
    }

    // Search
    if (effectiveSearch) {
      list = list.filter(
        (e) =>
          e.id.toLowerCase().includes(effectiveSearch) ||
          e.driver.name.toLowerCase().includes(effectiveSearch) ||
          e.vehicle.toLowerCase().includes(effectiveSearch)
      );
    }

    // Sort
    switch (sortBy) {
      case "Date (Newest)":
        // Default order (data is already newest first)
        break;
      case "Date (Oldest)":
        list.reverse();
        break;
      case "Cost (High)":
        list.sort((a, b) => b.totalCost - a.totalCost);
        break;
      case "Cost (Low)":
        list.sort((a, b) => a.totalCost - b.totalCost);
        break;
      case "Distance (High)":
        list.sort((a, b) => b.distance - a.distance);
        break;
      case "Distance (Low)":
        list.sort((a, b) => a.distance - b.distance);
        break;
    }

    return list;
  }, [filterBy, effectiveSearch, sortBy]);

  // Reset page on filter/search change
  useEffect(() => { setCurrentPage(1); }, [localSearch, searchQuery, filterBy, sortBy]);
  useEffect(() => { setCurrentPage(1); }, [pageSize]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /** Export filtered expenses as CSV. */
  const handleExport = useCallback(async () => {
    const blob = await expenseService.exportCSV(filtered.map((e) => e.id));
    downloadBlob(blob, "expenses-export.csv");
  }, [filtered]);

  /** Edit handler (stub). */
  const handleEdit = useCallback((id: string) => {
    console.log("[TripExpense] Edit expense:", id);
  }, []);

  const summaryCards = buildSummaryCards();

  return (
    <div>
      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            Expense &amp; Fuel Logging
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Track operational costs, fuel consumption, and miscellaneous expenses per trip.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={handleExport}
            {...pop}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            {...pop}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add an Expense
          </button>
        </div>
      </div>

      {/* Search + Toolbar */}
      <div ref={toolbarRef}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl">search</span>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Trip ID, Driver, or Vehicle..."
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
            />
          </div>

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen((p) => !p); setSortOpen(false); setGroupOpen(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filter
              {filterBy !== "All Statuses" && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{filterBy}</span>
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                {(["All Statuses", "Approved", "Pending", "Rejected"] as ExpenseFilterByOption[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilterBy(f); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      filterBy === f
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => { setSortOpen((p) => !p); setFilterOpen(false); setGroupOpen(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">sort</span>
              Sort by
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                {(["Date (Newest)", "Date (Oldest)", "Cost (High)", "Cost (Low)", "Distance (High)", "Distance (Low)"] as ExpenseSortByOption[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSortBy(s); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      sortBy === s
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Group by dropdown */}
          <div ref={groupRef} className="relative">
            <button
              onClick={() => { setGroupOpen((p) => !p); setFilterOpen(false); setSortOpen(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
              Group by
            </button>
            {groupOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                {(["None", "Status", "Driver", "Vehicle"] as ExpenseGroupByOption[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGroupBy(g); setGroupOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      groupBy === g
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards cards={summaryCards} />

      {/* Table */}
      <ExpenseTable
        expenses={paginated}
        totalResults={filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
      />

      {/* Add Expense Modal */}
      <NewExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </div>
  );
}
