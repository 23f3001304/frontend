/**
 * @module Trips
 * All Trips page — a dedicated, searchable, filterable list of every trip.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › All Trips).
 *  - Tab filters: All / On Trip / Loading / Maintenance / Ready.
 *  - Search by trip ID, vehicle, driver, or route.
 *  - Paginated desktop table + mobile card layout.
 *  - Per-row action menu.
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import gsap from "gsap";
import type { Trip, TripStatus } from "../types";
import { useClickPop, useStaggerRows } from "../hooks/useGsap";
import { fadeSlideIn, dropdownEnter } from "../lib/animations";
import { useDropdown } from "../hooks/useDropdown";
import { trips as allTrips } from "../data";
import { tripService } from "../services";
import { downloadBlob } from "../lib/download";
import Pagination from "../components/Pagination";
import { Can } from "../components/PermissionGate";

/* ───────── Status badge styles ───────── */

const statusStyles: Record<TripStatus, string> = {
  "On Trip": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Loading: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Ready: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

/** All possible tab values. */
type TripTab = "All" | TripStatus;

/* ───────── Action handlers (delegated to TripService) ───────── */

/** Navigate to trip detail view. */
const handleViewTrip = (id: string) => { tripService.getTripById(id); };
/** Open edit form for a trip. */
const handleEditTrip = (id: string) => { tripService.updateTrip(id, {}); };
/** Open driver-assignment flow. */
const handleAssignDriver = (id: string) => { tripService.assignDriver(id, ""); };
/** Cancel a trip via the service layer. */
const handleCancelTrip = (id: string) => { tripService.cancelTrip(id); };

/* ───────── Props ───────── */

interface TripsProps {
  /** Current table page size (driven by settings). */
  pageSize: number;
  /** Header search query passed from layout. */
  searchQuery: string;
  /** Opens the New Trip modal from the layout shell. */
  onNewTrip?: () => void;
}

/* ═══════════════════════════════════════════
 *  PAGE
 * ═══════════════════════════════════════════ */

export default function Trips({ pageSize, searchQuery, onNewTrip }: TripsProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TripTab>("All");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Combine local search with global search from header
  const combinedQuery = (search || searchQuery).toLowerCase().trim();

  // Filter logic
  const filtered = useMemo(() => {
    let list: Trip[] = allTrips;

    // Tab filter
    if (tab !== "All") {
      list = list.filter((t) => t.status === tab);
    }

    // Search filter
    if (combinedQuery) {
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(combinedQuery) ||
          t.vehicle.name.toLowerCase().includes(combinedQuery) ||
          t.vehicle.licensePlate.toLowerCase().includes(combinedQuery) ||
          (t.driver?.name.toLowerCase().includes(combinedQuery) ?? false) ||
          t.route.from.toLowerCase().includes(combinedQuery) ||
          t.route.to.toLowerCase().includes(combinedQuery) ||
          t.status.toLowerCase().includes(combinedQuery)
      );
    }

    return list;
  }, [tab, combinedQuery]);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, searchQuery, tab, pageSize]);

  // Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  /** Export filtered trips as CSV via TripService. */
  const handleExportCSV = useCallback(async () => {
    const blob = await tripService.exportCSV(filtered.map((t) => t.id));
    downloadBlob(blob, "trips-export.csv");
  }, [filtered]);

  /** Opens the New Trip modal (delegated to layout shell). */
  const handleNewTrip = useCallback(() => {
    onNewTrip?.();
  }, [onNewTrip]);

  const tabs: TripTab[] = ["All", "On Trip", "Loading", "Maintenance", "Ready"];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">All Trips</span>
      </nav>

      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            All Trips
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            {allTrips.length} trips across your fleet — search, filter, and manage.
          </p>
        </div>
        <Can permission="trips:create">
          <button
            onClick={handleNewTrip}
            {...pop}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors self-start sm:self-center"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            New Trip
          </button>
        </Can>
      </div>

      {/* Tabs + Toolbar */}
      <div ref={toolbarRef}>
        {/* Tab row */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                tab === t
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search + actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search input */}
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
              placeholder="Search by trip ID, vehicle, driver, or route..."
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition"
            />
          </div>

          {/* Export CSV */}
          <Can permission="analytics:export">
            <button
              onClick={handleExportCSV}
              {...pop}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          </Can>
        </div>
      </div>

      {/* Trip Table Card */}
      <TripTable
        trips={paginated}
        totalResults={filtered.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
 *  TRIP TABLE
 * ═══════════════════════════════════════════ */

function TripTable({
  trips,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
}: {
  trips: Trip[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([currentPage, trips.length], "tr");
  const mobileRef = useStaggerRows<HTMLDivElement>([currentPage, trips.length], "> *");

  // Entrance animation for the card wrapper
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(containerRef.current!, "up", { duration: 0.45, delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Trip ID", "Vehicle", "Driver", "Route", "ETA", "Status"].map(
                (col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider"
                  >
                    {col}
                  </th>
                )
              )}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody
            ref={tbodyRef}
            className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark"
          >
            {trips.map((trip, idx) => (
              <TripRow key={trip.id} trip={trip} isNearBottom={idx >= trips.length - 2} />
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                  <span className="material-symbols-outlined text-3xl mb-2 block">search_off</span>
                  No trips found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div ref={mobileRef} className="md:hidden divide-y divide-border-light dark:divide-border-dark">
        {trips.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="material-symbols-outlined text-3xl mb-2 block">search_off</span>
            No trips found matching your filters.
          </div>
        )}
        {trips.map((trip, idx) => (
          <MobileTripCard key={trip.id} trip={trip} isNearBottom={idx >= trips.length - 2} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        total={totalResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        label="trips"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
 *  TABLE ROW (desktop)
 * ═══════════════════════════════════════════ */

function TripRow({ trip, isNearBottom }: { trip: Trip; isNearBottom: boolean }) {
  const actionMenu = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionMenu.isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(menuRef.current!);
    });
    return () => ctx.revert();
  }, [actionMenu.isOpen]);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
        {trip.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="shrink-0 h-8 w-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-lg">local_shipping</span>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-text-light dark:text-text-dark">
              {trip.vehicle.name}
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              LP: {trip.vehicle.licensePlate}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {trip.driver ? (
            <>
              <img
                src={trip.driver.avatarUrl}
                alt={trip.driver.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-text-light dark:text-text-dark">
                  {trip.driver.name}
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 text-xs">
                --
              </span>
              <div className="ml-3">
                <div className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark italic">
                  Unassigned
                </div>
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-light dark:text-text-muted-dark">
        {trip.route.from} <span className="text-gray-400 mx-1">→</span> {trip.route.to}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
        {trip.eta}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[trip.status]}`}>
          {trip.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative" ref={actionMenu.ref}>
          <button
            onClick={actionMenu.toggle}
            className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {actionMenu.isOpen && (
            <div ref={menuRef}>
              <TripActionMenu tripId={trip.id} onClose={actionMenu.close} hasDriver={!!trip.driver} dropUp={isNearBottom} />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════
 *  MOBILE CARD
 * ═══════════════════════════════════════════ */

function MobileTripCard({ trip, isNearBottom }: { trip: Trip; isNearBottom: boolean }) {
  const actionMenu = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionMenu.isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(menuRef.current!);
    });
    return () => ctx.revert();
  }, [actionMenu.isOpen]);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{trip.id}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[trip.status]}`}>
            {trip.status}
          </span>
          <div className="relative" ref={actionMenu.ref}>
            <button
              onClick={actionMenu.toggle}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {actionMenu.isOpen && (
              <div ref={menuRef}>
                <TripActionMenu tripId={trip.id} onClose={actionMenu.close} hasDriver={!!trip.driver} dropUp={isNearBottom} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="shrink-0 h-8 w-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <span className="material-symbols-outlined text-lg">local_shipping</span>
        </div>
        <div>
          <div className="text-sm font-medium text-text-light dark:text-text-dark">{trip.vehicle.name}</div>
          <div className="text-xs text-text-muted-light dark:text-text-muted-dark">LP: {trip.vehicle.licensePlate}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted-light dark:text-text-muted-dark">
          {trip.route.from} <span className="text-gray-400 mx-1">→</span> {trip.route.to}
        </span>
        <span className="text-text-light dark:text-text-dark font-medium">ETA: {trip.eta}</span>
      </div>

      <div className="flex items-center gap-2">
        {trip.driver ? (
          <>
            <img src={trip.driver.avatarUrl} alt={trip.driver.name} className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs text-text-light dark:text-text-dark">{trip.driver.name}</span>
          </>
        ) : (
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
 *  ACTION MENU
 * ═══════════════════════════════════════════ */

function TripActionMenu({
  tripId,
  onClose,
  hasDriver,
  dropUp = false,
}: {
  tripId: string;
  onClose: () => void;
  hasDriver: boolean;
  dropUp?: boolean;
}) {
  return (
    <div
      className={`absolute right-0 w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50 ${
        dropUp ? "bottom-full mb-1" : "mt-1"
      }`}
    >
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => { handleViewTrip(tripId); onClose(); }}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">visibility</span>
        View Details
      </button>
      <Can permission="trips:edit">
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => { handleEditTrip(tripId); onClose(); }}
        >
          <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">edit</span>
          Edit Trip
        </button>
      </Can>
      {!hasDriver && (
        <Can permission="dispatcher:assign">
          <button
            className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => { handleAssignDriver(tripId); onClose(); }}
          >
            <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">person_add</span>
            Assign Driver
          </button>
        </Can>
      )}
      <div className="border-t border-border-light dark:border-border-dark my-1" />
      <Can permission="trips:delete">
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={() => { handleCancelTrip(tripId); onClose(); }}
        >
          <span className="material-symbols-outlined text-lg mr-2">cancel</span>
          Cancel Trip
        </button>
      </Can>
    </div>
  );
}
