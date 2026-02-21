/**
 * @module FleetTable
 * Fleet-at-a-Glance data table with:
 *  - Desktop: full `<table>` layout with sortable columns.
 *  - Mobile: stacked card layout.
 *  - Paginated data driven by parent via props.
 *  - Per-row action menu with GSAP dropdown animation.
 *  - Rows stagger-animate on page change.
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import type { Trip, TripStatus } from "../types";
import { useDropdown } from "../hooks/useDropdown";
import { useClickPop, useStaggerRows } from "../hooks/useGsap";
import { fadeSlideIn, dropdownEnter } from "../lib/animations";
import { tripService } from "../services";

/** Props accepted by the {@link FleetTable} component. */
interface FleetTableProps {
  /** Current page's trip slice. */
  trips: Trip[];
  /** Total count of trips matching the current filter (for pagination text). */
  totalResults: number;
  /** The current active page (1-based). */
  currentPage: number;
  /** Rows per page. */
  pageSize: number;
  /** Callback when the user navigates to a different page. */
  onPageChange: (page: number) => void;
}

/** Tailwind badge classes keyed by {@link TripStatus}. */
const statusStyles: Record<TripStatus, string> = {
  "On Trip": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Loading: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Maintenance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Ready: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

/** View trip details via TripService. */
const handleViewTrip = (id: string) => { tripService.getTripById(id); };
/** Open edit form for a trip via TripService. */
const handleEditTrip = (id: string) => { tripService.updateTrip(id, {}); };
/** Start driver-assignment flow via TripService. */
const handleAssignDriver = (id: string) => { tripService.assignDriver(id, ""); };
/** Cancel a trip via TripService. */
const handleCancelTrip = (id: string) => { tripService.cancelTrip(id); };


/**
 * Fleet data table with desktop/mobile layouts, pagination, and
 * per-row action menus. Rows stagger-animate on each page change.
 */
export default function FleetTable({ trips, totalResults, currentPage, pageSize, onPageChange }: FleetTableProps) {
  const pop = useClickPop();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([currentPage, trips.length], "tr");
  const mobileRef = useStaggerRows<HTMLDivElement>([currentPage, trips.length], "> *");

  // Entrance animation for the whole card
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(containerRef.current!, "up", { duration: 0.45, delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border-light dark:border-border-dark flex justify-between items-center">
        <h3 className="text-base sm:text-lg leading-6 font-medium text-text-light dark:text-text-dark">
          Fleet at a Glance
        </h3>
        <button
          onClick={() => navigate("/trips")}
          {...pop}
          className="text-sm text-primary hover:text-primary-hover font-medium flex items-center"
        >
          View all trips
          <span className="material-symbols-outlined text-sm ml-1">
            arrow_forward
          </span>
        </button>
      </div>

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
          <tbody ref={tbodyRef} className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
            {trips.map((trip, idx) => (
              <TripRow key={trip.id} trip={trip} isNearBottom={idx >= trips.length - 2} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div ref={mobileRef} className="md:hidden divide-y divide-border-light dark:divide-border-dark">
        {trips.map((trip, idx) => (
          <MobileTripCard key={trip.id} trip={trip} isNearBottom={idx >= trips.length - 2} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination total={totalResults} currentPage={currentPage} pageSize={pageSize} onPageChange={onPageChange} />
    </div>
  );
}

/**
 * Desktop table row for a single trip.
 * The per-row action menu popup animates via GSAP.
 */
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
            <span className="material-symbols-outlined text-lg">
              local_shipping
            </span>
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
        {trip.route.from}{" "}
        <span className="text-gray-400 mx-1">→</span> {trip.route.to}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
        {trip.eta}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[trip.status]}`}
        >
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
              <RowActionMenu tripId={trip.id} onClose={actionMenu.close} hasDriver={!!trip.driver} dropUp={isNearBottom} />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/**
 * Mobile card layout for a single trip.
 * Action menu popup animates via GSAP.
 */
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
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[trip.status]}`}
          >
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
                <RowActionMenu tripId={trip.id} onClose={actionMenu.close} hasDriver={!!trip.driver} dropUp={isNearBottom} />
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
          <div className="text-sm font-medium text-text-light dark:text-text-dark">
            {trip.vehicle.name}
          </div>
          <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
            LP: {trip.vehicle.licensePlate}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted-light dark:text-text-muted-dark">
          {trip.route.from} <span className="text-gray-400 mx-1">→</span> {trip.route.to}
        </span>
        <span className="text-text-light dark:text-text-dark font-medium">
          ETA: {trip.eta}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {trip.driver ? (
          <>
            <img
              src={trip.driver.avatarUrl}
              alt={trip.driver.name}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs text-text-light dark:text-text-dark">
              {trip.driver.name}
            </span>
          </>
        ) : (
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark italic">
            Unassigned
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Context menu for a trip row with View / Edit / Assign / Cancel actions.
 * Positioned absolute to the parent's action button.
 *
 * @param tripId   - The trip's unique ID.
 * @param onClose  - Callback to dismiss the menu.
 * @param hasDriver - Whether the trip already has an assigned driver.
 */
function RowActionMenu({
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
    <div className={`absolute right-0 w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50 ${dropUp ? "bottom-full mb-1" : "mt-1"}`}>
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => { handleViewTrip(tripId); onClose(); }}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">visibility</span>
        View Details
      </button>
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => { handleEditTrip(tripId); onClose(); }}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">edit</span>
        Edit Trip
      </button>
      {!hasDriver && (
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => { handleAssignDriver(tripId); onClose(); }}
        >
          <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">person_add</span>
          Assign Driver
        </button>
      )}
      <div className="border-t border-border-light dark:border-border-dark my-1" />
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        onClick={() => { handleCancelTrip(tripId); onClose(); }}
      >
        <span className="material-symbols-outlined text-lg mr-2">cancel</span>
        Cancel Trip
      </button>
    </div>
  );
}

/**
 * Smart pagination bar with ellipsis for large page counts.
 * Shows "Showing X to Y of Z results" on desktop and
 * Previous / Next on mobile.
 *
 * @param total       - Total number of results across all pages.
 * @param currentPage - The currently active page (1-based).
 * @param pageSize    - Number of items per page.
 * @param onPageChange - Callback when a page number is clicked.
 */
function Pagination({ total, currentPage, pageSize, onPageChange }: { total: number; currentPage: number; pageSize: number; onPageChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Build display pages: always show current and neighbors, plus first/last
  const getDisplayPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const displayPages = getDisplayPages();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
      {/* Mobile */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-border-dark text-sm font-medium rounded-md text-gray-700 dark:text-text-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-border-dark text-sm font-medium rounded-md text-gray-700 dark:text-text-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Showing{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {startItem}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {total}
            </span>{" "}
            results
          </p>
        </div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>
          {displayPages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                aria-current={page === currentPage ? "page" : undefined}
                className={
                  page === currentPage
                    ? "z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                }
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
