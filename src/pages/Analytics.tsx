/**
 * @module Analytics
 * Operational Analytics page.
 *
 * Features:
 *  - Title bar with date-range picker, vehicle filter, and "Update View" button.
 *  - 4 KPI cards (Avg Fuel Efficiency, Operational Cost, Total Revenue, Asset ROI).
 *  - Fuel Efficiency Trends bar chart (Daily / Weekly toggle).
 *  - Vehicle ROI Analysis panel with fleet margin breakdowns.
 *  - Export Reports panel (CSV, PDF, Email).
 *  - Transaction & Performance Log table with search and pagination.
 *  - GSAP entrance animations throughout.
 */

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn } from "../lib/animations";
import {
  fuelEfficiencyData,
  fleetROIData,
  vehicleAnalytics,
  TOTAL_ANALYTICS_VEHICLES,
} from "../data";
import {
  KpiCards,
  FuelEfficiencyChart,
  ROIAnalysis,
  ExportReports,
  TransactionLogTable,
} from "../components/analytics";
import type { KpiCardConfig } from "../components/analytics";

/* ─── Props ─── */

interface AnalyticsProps {
  /** Global search query from the header. */
  searchQuery: string;
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/* ─── Static KPI Data ─── */

const kpiCards: KpiCardConfig[] = [
  {
    icon: "local_gas_station",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    label: "Avg Fuel Efficiency",
    value: "12.8 km/L",
    badge: "+4.2%",
    badgeVariant: "positive",
  },
  {
    icon: "monitor_heart",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    label: "Operational Cost",
    value: "$45,210",
    badge: "Stable",
    badgeVariant: "neutral",
  },
  {
    icon: "trending_up",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    label: "Total Revenue",
    value: "$128,400",
    badge: "+12.5%",
    badgeVariant: "positive",
  },
  {
    icon: "hub",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    label: "Asset ROI",
    value: "2.84x",
    badge: "-2.1%",
    badgeVariant: "negative",
  },
];

/* ─── Component ─── */

export default function Analytics({ searchQuery, pageSize }: AnalyticsProps) {
  const [dateRange] = useState("Oct 1, 2023 - Oct 31, 2023");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");

  const pop = useClickPop();
  const titleRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Vehicle filter dropdown state
  const [vehicleFilterOpen, setVehicleFilterOpen] = useState(false);
  const vehicleFilterRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (vehicleFilterRef.current && !vehicleFilterRef.current.contains(e.target as Node)) {
        setVehicleFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (midRef.current) fadeSlideIn(midRef.current, "up", { duration: 0.3, delay: 0.1 });
      if (bottomRef.current) fadeSlideIn(bottomRef.current, "up", { duration: 0.3, delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  const vehicleOptions = ["All Vehicles", "Trucks", "Vans", "SUVs"];

  return (
    <div>
      {/* ── Title Row ── */}
      <div ref={titleRef} className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
              Operational Analytics
            </h2>
            <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
              Real-time performance tracking and ROI auditing.
            </p>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date range */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-sm text-text-light dark:text-text-dark">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <span>{dateRange}</span>
              <span className="material-symbols-outlined text-lg text-text-muted-light dark:text-text-muted-dark">
                expand_more
              </span>
            </div>

            {/* Vehicle filter */}
            <div ref={vehicleFilterRef} className="relative">
              <button
                onClick={() => setVehicleFilterOpen((p) => !p)}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-sm text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">filter_alt</span>
                {vehicleFilter}
                <span className="material-symbols-outlined text-lg text-text-muted-light dark:text-text-muted-dark">
                  expand_more
                </span>
              </button>
              {vehicleFilterOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
                  {vehicleOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setVehicleFilter(opt); setVehicleFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        vehicleFilter === opt
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Update View button */}
            <button
              {...pop}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Update View
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <KpiCards cards={kpiCards} />

      {/* ── Middle Row: Chart + ROI ── */}
      <div ref={midRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <FuelEfficiencyChart data={fuelEfficiencyData} />
        </div>
        <div className="lg:col-span-2">
          <ROIAnalysis fleets={fleetROIData} />
        </div>
      </div>

      {/* ── Bottom Row: Export + Transaction Log ── */}
      <div ref={bottomRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <ExportReports />
        </div>
        <div className="lg:col-span-4">
          <TransactionLogTable
            entries={vehicleAnalytics}
            totalResults={TOTAL_ANALYTICS_VEHICLES}
            pageSize={pageSize}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
