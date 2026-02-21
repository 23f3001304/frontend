/**
 * @module vehicles/MobileVehicleCard
 * Mobile card layout for a single vehicle.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Vehicle } from "../../types";
import { useDropdown } from "../../hooks/useDropdown";
import { dropdownEnter } from "../../lib/animations";
import { statusStyles, statusDot } from "./constants";
import ServiceToggle from "./ServiceToggle";
import VehicleActionMenu from "./VehicleActionMenu";

interface MobileVehicleCardProps {
  /** The vehicle data to render. */
  vehicle: Vehicle;
  /** Whether the vehicle's service mode is enabled. */
  inService: boolean;
  /** Callback to toggle the service mode. */
  onToggle: () => void;
  /** If true, the action menu opens upward. */
  isNearBottom: boolean;
}

/** Mobile card layout for a single vehicle. */
export default function MobileVehicleCard({
  vehicle: v,
  inService,
  onToggle,
  isNearBottom,
}: MobileVehicleCardProps) {
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
      <div className="flex items-start justify-between">
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
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[v.status]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[v.status]}`} />
            {v.status}
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
                <VehicleActionMenu
                  vehicleId={v.id}
                  onClose={actionMenu.close}
                  dropUp={isNearBottom}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Plate</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {v.licensePlate}
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Capacity</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {v.maxCapacity.toLocaleString()} lbs
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Odometer</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {v.odometer.toLocaleString()} mi
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
          Service Mode
        </span>
        <ServiceToggle enabled={inService} onToggle={onToggle} />
      </div>
    </div>
  );
}
