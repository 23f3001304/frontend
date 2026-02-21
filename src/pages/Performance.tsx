/**
 * @module Performance
 * Driver Performance & Safety Profiles page.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › Performance).
 *  - 4 KPI stat cards (Total Drivers, Avg Safety Score, License Alerts, Active Drivers).
 *  - Search by name or license number.
 *  - Group By and Filter toolbar dropdowns.
 *  - "+ Add Driver" modal with validation.
 *  - Desktop table + mobile card layout with pagination.
 *  - Compliance legend and last-sync footer.
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn } from "../lib/animations";
import { drivers, TOTAL_DRIVERS } from "../data";
import type { StatCard } from "../types";
import StatsCards from "../components/StatsCards";
import { DriverTable, NewDriverModal } from "../components/drivers";
import type { DriverTabFilter, DriverFilterByOption } from "../components/drivers";
import { driverService } from "../services";
import { downloadBlob } from "../lib/download";

/* ─── Props ─── */

interface PerformanceProps {
  /** Global search query from the header. */
  searchQuery: string;
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/* ─── Derived Stats ─── */

/** Build the 4 KPI stat cards from driver data. */
function buildStatCards(): StatCard[] {
  const totalDrivers = TOTAL_DRIVERS;
  const activeDrivers = drivers.filter((d) => d.dutyStatus === "On Duty").length;
  const avgSafety = Math.round(
    drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length
  );
  const licenseAlerts = drivers.filter(
    (d) => d.licenseExpiryDays != null && d.licenseExpiryDays <= 30
  ).length;

  return [
    {
      icon: "groups",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      label: "Total Drivers",
      value: totalDrivers,
      footer: "↑ 4% from last month",
      footerColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: "verified_user",
      iconColor: "text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      label: "Avg Safety Score",
      value: `${avgSafety}%`,
      footer: "↑ 1% improvement",
      footerColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: "warning",
      iconColor: "text-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      label: "License Alerts",
      value: licenseAlerts,
      footer: "Expiring soon",
      footerColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: "directions_run",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      label: "Active Drivers",
      value: activeDrivers,
      footer: `/ ${totalDrivers} Total`,
      footerColor: "text-text-muted-light dark:text-text-muted-dark",
    },
  ];
}

/* ─── Page ─── */

export default function Performance({ searchQuery, pageSize }: PerformanceProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [tab, setTab] = useState<DriverTabFilter>("All");
  const [filterBy, setFilterBy] = useState<DriverFilterByOption>("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [dutyState, setDutyState] = useState<Record<string, string>>(() =>
    Object.fromEntries(drivers.map((d) => [d.id, d.dutyStatus]))
  );

  // Dropdown open states
  const [groupOpen, setGroupOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<string>("Status");

  // Modal
  const [showAddDriver, setShowAddDriver] = useState(false);

  const pop = useClickPop();
  const titleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
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
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) setGroupOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Combine local + global search
  const effectiveSearch = (localSearch || searchQuery || "").toLowerCase().trim();

  // Filter logic
  const filtered = useMemo(() => {
    let list = drivers.map((d) => ({
      ...d,
      dutyStatus: (dutyState[d.id] ?? d.dutyStatus) as typeof d.dutyStatus,
    }));

    // Tab filter
    if (tab !== "All") {
      list = list.filter((d) => d.dutyStatus === tab);
    }

    // Status dropdown filter
    if (filterBy !== "All Statuses") {
      list = list.filter((d) => d.dutyStatus === filterBy);
    }

    // Search
    if (effectiveSearch) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(effectiveSearch) ||
          d.id.toLowerCase().includes(effectiveSearch) ||
          d.licenseNumber.toLowerCase().includes(effectiveSearch)
      );
    }

    return list;
  }, [tab, filterBy, effectiveSearch, dutyState]);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [localSearch, searchQuery, tab, filterBy]);
  useEffect(() => { setCurrentPage(1); }, [pageSize]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /** Toggle driver duty status. */
  const toggleDuty = useCallback((id: string) => {
    setDutyState((prev) => {
      const current = prev[id] || "Off Duty";
      const next = current === "On Duty" ? "Off Duty" : "On Duty";
      void driverService.toggleDutyStatus(id, next as "On Duty" | "Off Duty");
      return { ...prev, [id]: next };
    });
  }, []);

  /** Export filtered drivers as CSV. */
  const handleExport = useCallback(async () => {
    const blob = await driverService.exportCSV(filtered.map((d) => d.id));
    downloadBlob(blob, "drivers-export.csv");
  }, [filtered]);

  const statCards = buildStatCards();

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">Performance</span>
      </nav>

      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            Driver Performance &amp; Safety Profiles
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Monitor {TOTAL_DRIVERS} drivers across your fleet operations.
          </p>
        </div>
        <button
          onClick={() => setShowAddDriver(true)}
          {...pop}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards cards={statCards} />

      {/* Tabs + Toolbar */}
      <div ref={toolbarRef}>
        {/* Tab row */}
        <div className="flex items-center gap-1 mb-4">
          {(["All", "On Duty", "Off Duty", "Suspended"] as DriverTabFilter[]).map((t) => (
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
              placeholder="Search by name, license #..."
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
            />
          </div>

          {/* Group by dropdown */}
          <div ref={groupRef} className="relative">
            <button
              onClick={() => { setGroupOpen((p) => !p); setFilterOpen(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Group by:</span>
              {groupBy}
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
            {groupOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                {["Status", "Compliance", "None"].map((g) => (
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

          {/* Filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen((p) => !p); setGroupOpen(false); }}
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
                {(["All Statuses", "On Duty", "Off Duty", "Suspended"] as DriverFilterByOption[]).map((f) => (
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
      <DriverTable
        drivers={paginated}
        totalResults={filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onToggleDuty={toggleDuty}
      />

      {/* Compliance Legend & Last Sync */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-text-light dark:text-text-dark uppercase tracking-wider mb-2">
            Compliance Legend
          </h4>
          <div className="flex items-center gap-4 text-xs text-text-muted-light dark:text-text-muted-dark">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Good Standing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              Warning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Critical / Suspended
            </span>
          </div>
        </div>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          Last Data Sync: Today, 10:45 AM
        </p>
      </div>

      {/* Add Driver Modal */}
      <NewDriverModal
        open={showAddDriver}
        onClose={() => setShowAddDriver(false)}
      />
    </div>
  );
}
