/**
 * @module expenses/ExpenseRow
 * Desktop table row for a single trip expense record.
 */

import type { TripExpense } from "../../types";
import { expenseStatusStyles, formatCurrency, formatDistance } from "./constants";
import { Can } from "../PermissionGate";

interface ExpenseRowProps {
  /** The expense data to render. */
  expense: TripExpense;
  /** Callback when the Edit button is clicked. */
  onEdit: () => void;
}

/** Single desktop table row for an expense record. */
export default function ExpenseRow({ expense: e, onEdit }: ExpenseRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Trip ID */}
      <td className="px-4 py-4">
        <span className="text-sm font-semibold text-primary">{e.id}</span>
      </td>
      {/* Driver / Vehicle */}
      <td className="px-4 py-4">
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
      </td>
      {/* Distance */}
      <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        {formatDistance(e.distance)}
      </td>
      {/* Fuel Expense */}
      <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        {formatCurrency(e.fuelExpense)}
      </td>
      {/* Misc. Expense */}
      <td className="px-4 py-4 text-sm text-text-light dark:text-text-dark whitespace-nowrap">
        {formatCurrency(e.miscExpense)}
      </td>
      {/* Total Cost */}
      <td className="px-4 py-4">
        <span className="text-sm font-bold text-text-light dark:text-text-dark">
          {formatCurrency(e.totalCost)}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${expenseStatusStyles[e.status]}`}
        >
          {e.status}
        </span>
      </td>
      {/* Edit */}
      <td className="px-4 py-4">
        <Can permission="expenses:edit">
          <button
            onClick={onEdit}
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            Edit
          </button>
        </Can>
      </td>
    </tr>
  );
}
