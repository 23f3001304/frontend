/**
 * @module VehicleRegistry
 * Vehicle Registry page — a searchable, filterable table of all fleet vehicles.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › Vehicle Registry).
 *  - Tab filters: All / Active / In Maintenance.
 *  - Search by name, model, or license plate.
 *  - Vehicle Type dropdown filter.
 *  - Export CSV action button.
 *  - Desktop table + mobile card layout with pagination.
 *  - Per-row action menu & service toggle.
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import gsap from "gsap";
import type { VehicleCategory } from "../types";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn } from "../lib/animations";
import { fleetService } from "../services";
import { downloadBlob } from "../lib/download";
import { vehicles } from "../data";
import { VehicleTable, VehicleTypeDropdown, NewVehicleModal } from "../components/vehicles";
import type { TabFilter } from "../components/vehicles";

/** Props accepted by the {@link VehicleRegistry} page. */
interface VehicleRegistryProps {
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/**
 * Vehicle Registry page.
 * Renders a filterable, searchable vehicle table with pagination.
 */
export default function VehicleRegistry({ pageSize }: VehicleRegistryProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceState, setServiceState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(vehicles.map((v) => [v.id, v.inService]))
  );
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const pop = useClickPop();
  const titleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (toolbarRef.current) fadeSlideIn(toolbarRef.current, "up", { duration: 0.25, delay: 0.08 });
    });
    return () => ctx.revert();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    let list = vehicles;

    if (tab === "Active") {
      list = list.filter((v) => v.status === "Available" || v.status === "On Trip");
    } else if (tab === "In Maintenance") {
      list = list.filter((v) => v.status === "In Shop");
    }

    if (categoryFilter) {
      list = list.filter((v) => v.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.licensePlate.toLowerCase().includes(q)
      );
    }

    return list;
  }, [search, tab, categoryFilter]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, tab, categoryFilter]);

  // Reset page when pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /** Toggle vehicle service mode via FleetService. */
  const toggleService = useCallback((id: string) => {
    setServiceState((prev) => {
      const newVal = !prev[id];
      void fleetService.toggleService(id, newVal);
      return { ...prev, [id]: newVal };
    });
  }, []);

  /** Export filtered vehicles as CSV via FleetService. */
  const handleExportCSV = useCallback(async () => {
    const blob = await fleetService.exportCSV(filtered.map((v) => v.id));
    downloadBlob(blob, "vehicles-export.csv");
  }, [filtered]);

  /** TODO: Connect to backend — open Add Vehicle form/modal. */
  const handleAddVehicle = useCallback(() => {
    setShowAddVehicle(true);
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">Vehicle Registry</span>
      </nav>

      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            Vehicle Registry
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Manage {vehicles.length} active assets across your logistics network.
          </p>
        </div>
        <button
          onClick={handleAddVehicle}
          {...pop}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Add New Vehicle
        </button>
      </div>

      {/* Tabs + Toolbar */}
      <div ref={toolbarRef}>
        {/* Tab row */}
        <div className="flex items-center gap-1 mb-4">
          {(["All", "Active", "In Maintenance"] as TabFilter[]).map((t) => (
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

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl">
                search
              </span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, model, or license plate..."
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
            />
          </div>

          {/* Vehicle Type dropdown */}
          <VehicleTypeDropdown value={categoryFilter} onChange={setCategoryFilter} />

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            {...pop}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table card */}
      <VehicleTable
        vehicles={paginated}
        totalResults={filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        serviceState={serviceState}
        onToggleService={toggleService}
      />

      {/* Add New Vehicle Modal */}
      <NewVehicleModal
        open={showAddVehicle}
        onClose={() => setShowAddVehicle(false)}
      />
    </div>
  );
}
