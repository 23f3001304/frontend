/**
 * @module expenses/MobileExpenseCard
 * Mobile card layout for a single trip expense record.
 */

import type { TripExpense } from "../../types";
import { expenseStatusStyles, formatCurrency, formatDistance } from "./constants";

interface MobileExpenseCardProps {
  /** The expense data to render. */
  expense: TripExpense;
  /** Callback when the Edit button is clicked. */
  onEdit: () => void;
}

/** Mobile card layout for a single expense record. */
export default function MobileExpenseCard({ expense: e, onEdit }: MobileExpenseCardProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`shrink-0 h-9 w-9 rounded-full ${e.driver.avatarColor} flex items-center justify-center`}
          >
            <span className="text-xs font-bold text-white">{e.driver.initials}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-light dark:text-text-dark">
              {e.driver.name}
            </div>
            <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {e.vehicle}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${expenseStatusStyles[e.status]}`}
          >
            {e.status}
          </span>
          <button
            onClick={onEdit}
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
          Trip <span className="font-semibold text-primary">{e.id}</span>
        </span>
        <span className="text-sm font-bold text-text-light dark:text-text-dark">
          {formatCurrency(e.totalCost)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Distance</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {formatDistance(e.distance)}
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Fuel</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {formatCurrency(e.fuelExpense)}
          </div>
        </div>
        <div>
          <span className="text-text-muted-light dark:text-text-muted-dark">Misc.</span>
          <div className="font-semibold text-text-light dark:text-text-dark mt-0.5">
            {formatCurrency(e.miscExpense)}
          </div>
        </div>
      </div>
    </div>
  );
}
