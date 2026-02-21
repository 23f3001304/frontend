/**
 * @module expenses/ExpenseTable
 * Responsive expense table with desktop rows, mobile cards, and pagination.
 */

import type { TripExpense } from "../../types";
import { useStaggerRows } from "../../hooks/useGsap";
import ExpenseRow from "./ExpenseRow";
import MobileExpenseCard from "./MobileExpenseCard";
import Pagination from "../Pagination";

interface ExpenseTableProps {
  /** Paginated expenses to display. */
  expenses: TripExpense[];
  /** Total number of filtered expenses (for pagination count). */
  totalResults: number;
  /** Current page number. */
  currentPage: number;
  /** Rows per page. */
  pageSize: number;
  /** Callback to change page. */
  onPageChange: (page: number) => void;
  /** Callback when Edit is clicked for a record. */
  onEdit: (id: string) => void;
}

/** Responsive expense table with pagination. */
export default function ExpenseTable({
  expenses,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
}: ExpenseTableProps) {
  const tbodyRef = useStaggerRows<HTMLTableSectionElement>([currentPage, expenses.length], "tr");
  const mobileRef = useStaggerRows<HTMLDivElement>([currentPage, expenses.length], ":scope > *");

  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden">

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {[
                "Trip ID",
                "Driver / Vehicle",
                "Distance",
                "Fuel Expense",
                "Misc. Expense",
                "Total Cost",
                "Status",
                "",
              ].map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-xs font-semibold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            ref={tbodyRef}
            className="divide-y divide-border-light dark:divide-border-dark"
          >
            {expenses.map((e) => (
              <ExpenseRow
                key={e.id}
                expense={e}
                onEdit={() => onEdit(e.id)}
              />
            ))}
            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark"
                >
                  No expenses match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div
        ref={mobileRef}
        className="md:hidden divide-y divide-border-light dark:divide-border-dark"
      >
        {expenses.map((e) => (
          <MobileExpenseCard
            key={e.id}
            expense={e}
            onEdit={() => onEdit(e.id)}
          />
        ))}
        {expenses.length === 0 && (
          <div className="px-6 py-12 text-center text-text-muted-light dark:text-text-muted-dark">
            No expenses match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        total={totalResults}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        label="results"
      />
    </div>
  );
}
