/**
 * @module analytics/TransactionLogRow
 * A single row in the Transaction & Performance Log table.
 *
 * Columns: Vehicle ID, Status badge, Fuel Efficiency, Op. Cost, Revenue, Action (…).
 */

import { useHoverLift } from "../../hooks/useGsap";
import type { VehicleAnalyticsEntry } from "../../types";
import { healthStatusStyles, formatCurrency, formatRevenue } from "./constants";
import { useDropdown } from "../../hooks/useDropdown";

interface TransactionLogRowProps {
  entry: VehicleAnalyticsEntry;
  onViewDetails?: (vehicleId: string) => void;
}

export default function TransactionLogRow({ entry, onViewDetails }: TransactionLogRowProps) {
  const hover = useHoverLift();
  const { isOpen, toggle, ref: menuWrapRef } = useDropdown();
  const style = healthStatusStyles[entry.status];

  return (
    <tr
      className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      {...hover}
    >
      {/* Vehicle ID */}
      <td className="px-4 py-3 text-sm font-medium text-text-light dark:text-text-dark whitespace-nowrap">
        {entry.vehicleId}
      </td>

      {/* Status */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
        >
          {entry.status}
        </span>
      </td>

      {/* Fuel Efficiency */}
      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        {entry.fuelEfficiency.toFixed(1)} km/L
      </td>

      {/* Op. Cost */}
      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        {formatCurrency(entry.opCost)}
      </td>

      {/* Revenue */}
      <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
        {formatRevenue(entry.revenue)}
      </td>

      {/* Action */}
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <div ref={menuWrapRef} className="relative inline-block">
          <button
            onClick={toggle}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">
              more_horiz
            </span>
          </button>
          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40">
              <button
                onClick={() => { onViewDetails?.(entry.vehicleId); toggle(); }}
                className="w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                View Details
              </button>
              <button
                onClick={toggle}
                className="w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Entry
              </button>
              <button
                onClick={toggle}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">flag</span>
                Flag Issue
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
