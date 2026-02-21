/**
 * @module drivers/MobileDriverCard
 * Mobile card layout for a single driver.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Driver } from "../../types";
import { useDropdown } from "../../hooks/useDropdown";
import { dropdownEnter } from "../../lib/animations";
import { completionRateColor } from "./constants";
import SafetyScoreRing from "./SafetyScoreRing";
import DutyToggle from "./DutyToggle";
import DriverActionMenu from "./DriverActionMenu";

interface MobileDriverCardProps {
  /** The driver data to render. */
  driver: Driver;
  /** Callback to toggle the duty status. */
  onToggleDuty: () => void;
  /** If true, the action menu opens upward. */
  isNearBottom: boolean;
}

/** Mobile card layout for a single driver. */
export default function MobileDriverCard({
  driver: d,
  onToggleDuty,
  isNearBottom,
}: MobileDriverCardProps) {
  const actionMenu = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  const isExpiryWarning = d.licenseExpiryDays != null && d.licenseExpiryDays <= 30;

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
          {d.avatarUrl ? (
            <img src={d.avatarUrl} alt={d.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="shrink-0 h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-gray-500 dark:text-gray-400">person</span>
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-text-light dark:text-text-dark">
              {d.name}
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              ID: {d.id}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SafetyScoreRing score={d.safetyScore} size={36} />
          <div className="relative" ref={actionMenu.ref}>
            <button
              onClick={actionMenu.toggle}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </button>
            {actionMenu.isOpen && (
              <div ref={menuRef}>
                <DriverActionMenu
                  driverId={d.id}
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
          <span className="text-text-muted-light dark:text-text-muted-dark">License</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {d.licenseNumber}
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Expiry</span>
          <div className={`font-semibold mt-0.5 ${isExpiryWarning ? "text-red-600 dark:text-red-400" : "text-text-light dark:text-text-dark"}`}>
            {d.licenseExpiry}
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Completion</span>
          <div className={`font-semibold mt-0.5 ${completionRateColor(d.completionRate)}`}>
            {d.completionRate}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
            Complaints: <span className="font-semibold text-text-light dark:text-text-dark">{d.complaints}</span>
          </span>
        </div>
        <DutyToggle status={d.dutyStatus} onToggle={onToggleDuty} />
      </div>
    </div>
  );
}
