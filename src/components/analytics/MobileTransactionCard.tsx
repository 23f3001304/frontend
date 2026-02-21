/**
 * @module analytics/MobileTransactionCard
 * Mobile-friendly card layout for a single Transaction & Performance Log entry.
 */

import { useHoverLift } from "../../hooks/useGsap";
import type { VehicleAnalyticsEntry } from "../../types";
import { healthStatusStyles, formatCurrency, formatRevenue } from "./constants";

interface MobileTransactionCardProps {
  entry: VehicleAnalyticsEntry;
}

export default function MobileTransactionCard({ entry }: MobileTransactionCardProps) {
  const hover = useHoverLift();
  const style = healthStatusStyles[entry.status];

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 will-change-transform"
      {...hover}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-text-light dark:text-text-dark">
          {entry.vehicleId}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
        >
          {entry.status}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Fuel Eff.</p>
          <p className="text-sm font-medium text-text-light dark:text-text-dark">
            {entry.fuelEfficiency.toFixed(1)} km/L
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Op. Cost</p>
          <p className="text-sm font-medium text-text-light dark:text-text-dark">
            {formatCurrency(entry.opCost)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Revenue</p>
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            {formatRevenue(entry.revenue)}
          </p>
        </div>
      </div>
    </div>
  );
}
