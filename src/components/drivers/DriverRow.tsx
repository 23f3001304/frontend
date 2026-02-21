/**
 * @module drivers/DriverRow
 * Desktop table row for a single driver.
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

interface DriverRowProps {
  /** The driver data to render. */
  driver: Driver;
  /** Callback to toggle the duty status. */
  onToggleDuty: () => void;
  /** If true, the action menu opens upward to avoid overflow. */
  isNearBottom: boolean;
}

/** Single desktop table row for a driver. */
export default function DriverRow({
  driver: d,
  onToggleDuty,
  isNearBottom,
}: DriverRowProps) {
  const actionMenu = useDropdown();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionMenu.isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(menuRef.current!);
    });
    return () => ctx.revert();
  }, [actionMenu.isOpen]);

  const isExpiryWarning = d.licenseExpiryDays != null && d.licenseExpiryDays <= 30;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Driver Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {d.avatarUrl ? (
            <img
              src={d.avatarUrl}
              alt={d.name}
              className="h-9 w-9 rounded-full object-cover shrink-0"
            />
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
      </td>
      {/* License # */}
      <td className="px-4 py-4">
        <span className="text-sm font-medium text-text-light dark:text-text-dark">
          {d.licenseNumber}
        </span>
      </td>
      {/* Expiry */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm ${
              isExpiryWarning
                ? "text-red-600 dark:text-red-400 font-semibold"
                : "text-text-light dark:text-text-dark"
            }`}
          >
            {d.licenseExpiry}
          </span>
          {isExpiryWarning && (
            <span className="material-symbols-outlined text-red-500 text-base">error</span>
          )}
        </div>
      </td>
      {/* Completion Rate */}
      <td className="px-4 py-4">
        <span className={`text-sm font-semibold ${completionRateColor(d.completionRate)}`}>
          {d.completionRate}%
        </span>
      </td>
      {/* Safety Score */}
      <td className="px-4 py-4">
        <SafetyScoreRing score={d.safetyScore} />
      </td>
      {/* Complaints */}
      <td className="px-4 py-4">
        <span
          className={`text-sm font-semibold ${
            d.complaints >= 10
              ? "text-red-600 dark:text-red-400"
              : d.complaints >= 5
                ? "text-orange-500 dark:text-orange-400"
                : "text-text-light dark:text-text-dark"
          }`}
        >
          {d.complaints}
        </span>
      </td>
      {/* Duty Status */}
      <td className="px-4 py-4">
        <DutyToggle status={d.dutyStatus} onToggle={onToggleDuty} />
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
              <DriverActionMenu
                driverId={d.id}
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
