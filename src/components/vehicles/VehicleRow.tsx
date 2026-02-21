/**
 * @module vehicles/VehicleRow
 * Desktop table row for a single vehicle.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Vehicle } from "../../types";
import { useDropdown } from "../../hooks/useDropdown";
import { dropdownEnter } from "../../lib/animations";
import { statusStyles, statusDot } from "./constants";
import ServiceToggle from "./ServiceToggle";
import VehicleActionMenu from "./VehicleActionMenu";

interface VehicleRowProps {
  /** The vehicle data to render. */
  vehicle: Vehicle;
  /** Whether the vehicle's service mode is enabled. */
  inService: boolean;
  /** Callback to toggle the service mode. */
  onToggle: () => void;
  /** If true, the action menu opens upward to avoid overflow. */
  isNearBottom: boolean;
}

/** Single desktop table row for a vehicle. */
export default function VehicleRow({
  vehicle: v,
  inService,
  onToggle,
  isNearBottom,
}: VehicleRowProps) {
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
      {/* Name / Model */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-xl">{v.icon}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-light dark:text-text-dark">
              {v.name}
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {v.category} &middot; {v.year}
            </div>
          </div>
        </div>
      </td>
      {/* License Plate */}
      <td className="px-4 py-4">
        <span className="inline-block px-2.5 py-1 text-xs font-bold border border-border-light dark:border-border-dark rounded-md bg-gray-50 dark:bg-gray-800 text-text-light dark:text-text-dark tracking-wide">
          {v.licensePlate}
        </span>
      </td>
      {/* Max Capacity */}
      <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        <span className="font-semibold">{v.maxCapacity.toLocaleString()}</span>
        <span className="text-text-muted-light dark:text-text-muted-dark ml-1">lbs</span>
      </td>
      {/* Odometer */}
      <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        <span className="font-semibold">{v.odometer.toLocaleString()}</span>
        <span className="text-text-muted-light dark:text-text-muted-dark ml-1">mi</span>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[v.status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[v.status]}`} />
          {v.status}
        </span>
      </td>
      {/* Service Toggle */}
      <td className="px-4 py-4">
        <ServiceToggle enabled={inService} onToggle={onToggle} />
      </td>
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="relative" ref={actionMenu.ref}>
          <button
            onClick={actionMenu.toggle}
            className="p-1 rounded-md text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
          {actionMenu.isOpen && (
            <div ref={menuRef}>
              <VehicleActionMenu
                vehicleId={v.id}
                onClose={actionMenu.close}
                dropUp={isNearBottom}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
