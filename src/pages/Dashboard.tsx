/**
 * @module Dashboard
 * The main Command Center dashboard page.
 *
 * Displays KPI stats, a paginated fleet table, and bottom widgets
 * (vehicle types, alerts, download report). Includes a simulated
 * loading state with skeleton placeholders and GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import StatsCards from "../components/StatsCards";
import FleetTable from "../components/FleetTable";
import BottomWidgets from "../components/BottomWidgets";
import {
  StatsCardsSkeleton,
  FleetTableSkeleton,
  BottomWidgetsSkeleton,
} from "../components/Skeletons";
import { fadeSlideIn } from "../lib/animations";
import {
  statCards,
  trips,
  vehicleTypes,
  recentAlerts,
} from "../data";

/** Props accepted by the {@link Dashboard} page. */
interface DashboardProps {
  /** Current header search query text (driven by layout). */
  searchQuery: string;
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/**
 * Fleet Flow Command Center dashboard page.
 * Shows stats cards, fleet table with pagination, and bottom widgets.
 */
export default function Dashboard({ searchQuery, pageSize }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Simulate data fetching delay
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter trips by search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    const q = searchQuery.toLowerCase();
    return trips.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.vehicle.name.toLowerCase().includes(q) ||
        t.vehicle.licensePlate.toLowerCase().includes(q) ||
        (t.driver?.name.toLowerCase().includes(q) ?? false) ||
        t.route.from.toLowerCase().includes(q) ||
        t.route.to.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Reset to page 1 when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Paginate filtered trips
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTrips.slice(start, start + pageSize);
  }, [filteredTrips, currentPage, pageSize]);

  // Page title entrance animation
  const titleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (loading || !titleRef.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(titleRef.current!, "left", { duration: 0.4, x: -20 });
    });
    return () => ctx.revert();
  }, [loading]);

  return (
    <>
      {/* Page Title */}
      <div ref={titleRef} className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold leading-7 text-text-light dark:text-text-dark">
          Command Center
        </h2>
        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
          Real-time overview of fleet operations, alerts, and performance.
        </p>
      </div>

      {/* Stats */}
      {loading ? <StatsCardsSkeleton /> : <StatsCards cards={statCards} />}

      {/* Fleet Table */}
      {loading ? (
        <FleetTableSkeleton rows={4} />
      ) : (
        <FleetTable
          trips={paginatedTrips}
          totalResults={filteredTrips.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Bottom Widgets */}
      {loading ? (
        <BottomWidgetsSkeleton />
      ) : (
        <BottomWidgets
          vehicleTypes={vehicleTypes}
          alerts={recentAlerts}
        />
      )}
    </>
  );
}
