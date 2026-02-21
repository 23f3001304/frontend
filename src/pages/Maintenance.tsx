/**
 * @module Maintenance
 * Maintenance & Service Logs page — searchable, filterable table of all service records.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › Maintenance).
 *  - Tab filters: All / New / In Shop / Completed.
 *  - Search by vehicle name, license plate, issue, or log ID.
 *  - Group By, Filter, Sort By toolbar dropdowns.
 *  - "+ Create New Service" modal with validation.
 *  - Desktop table + mobile card layout with pagination.
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn } from "../lib/animations";
import {
  ServiceLogTable,
  serviceLogs,
  type MaintenanceTabFilter,
  type SortByOption,
  type FilterByOption,
} from "../components/maintenance";
import NewServiceModal from "../components/maintenance/NewServiceModal";
import { maintenanceService } from "../services";
import { downloadBlob } from "../lib/download";

/* ─── Props ─── */

interface MaintenanceProps {
  /** Global search query from the header. */
  searchQuery: string;
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/* ─── Page ─── */

export default function Maintenance({ searchQuery, pageSize }: MaintenanceProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [tab, setTab] = useState<MaintenanceTabFilter>("All");
  const [sortBy, setSortBy] = useState<SortByOption>("Date (Newest)");
  const [filterBy, setFilterBy] = useState<FilterByOption>("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown open states
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Modal
  const [showNewService, setShowNewService] = useState(false);

  const pop = useClickPop();
  const titleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

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
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Combine local + global search
  const effectiveSearch = (localSearch || searchQuery || "").toLowerCase().trim();

  // Filter logic
  const filtered = useMemo(() => {
    let list = [...serviceLogs];

    // Tab filter
    if (tab !== "All") {
      list = list.filter((l) => l.status === tab);
    }

    // Status dropdown filter
    if (filterBy !== "All Statuses") {
      list = list.filter((l) => l.status === filterBy);
    }

    // Search
    if (effectiveSearch) {
      list = list.filter(
        (l) =>
          l.id.toLowerCase().includes(effectiveSearch) ||
          l.vehicle.name.toLowerCase().includes(effectiveSearch) ||
          l.vehicle.licensePlate.toLowerCase().includes(effectiveSearch) ||
          l.issue.toLowerCase().includes(effectiveSearch) ||
          l.serviceType.toLowerCase().includes(effectiveSearch)
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
        list.sort((a, b) => b.cost - a.cost);
        break;
      case "Cost (Low)":
        list.sort((a, b) => a.cost - b.cost);
        break;
      case "ID":
        list.sort((a, b) => {
          const aNum = parseInt(a.id.replace("#", ""));
          const bNum = parseInt(b.id.replace("#", ""));
          return bNum - aNum;
        });
        break;
    }

    return list;
  }, [tab, filterBy, effectiveSearch, sortBy]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [localSearch, searchQuery, tab, sortBy, filterBy]);
  useEffect(() => { setCurrentPage(1); }, [pageSize]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /** Export filtered service logs as CSV via MaintenanceService. */
  const handleExport = useCallback(async () => {
    const blob = await maintenanceService.exportCSV(filtered.map((l) => l.id));
    downloadBlob(blob, "service-logs-export.csv");
  }, [filtered]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">Maintenance</span>
      </nav>

      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            Maintenance &amp; Service Logs
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Track and manage {serviceLogs.length} service records across your fleet.
          </p>
        </div>
        <button
          onClick={() => setShowNewService(true)}
          {...pop}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Create New Service
        </button>
      </div>

      {/* Tabs + Toolbar */}
      <div ref={toolbarRef}>
        {/* Tab row */}
        <div className="flex items-center gap-1 mb-4">
          {(["All", "New", "In Shop", "Completed"] as MaintenanceTabFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search + toolbar buttons */}
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
              placeholder="Search by vehicle, issue, log ID, or plate..."
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
            />
          </div>

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen((p) => !p); setSortOpen(false); }}
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
                {(["All Statuses", "New", "In Shop", "Completed", "Cancelled"] as FilterByOption[]).map((f) => (
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

          {/* Sort dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => { setSortOpen((p) => !p); setFilterOpen(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">sort</span>
              Sort By
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                {(["Date (Newest)", "Date (Oldest)", "Cost (High)", "Cost (Low)", "ID"] as SortByOption[]).map((s) => (
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

          {/* Export */}
          <button
            onClick={handleExport}
            {...pop}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <ServiceLogTable
        logs={paginated}
        totalResults={filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* New Service Modal */}
      <NewServiceModal
        open={showNewService}
        onClose={() => setShowNewService(false)}
      />
    </div>
  );
}
