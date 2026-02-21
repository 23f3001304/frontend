/**
 * @module maintenance/ServiceLogTable
 * Desktop table + mobile card list for service logs, with pagination.
 */

import type { ServiceLog } from "./constants";
import ServiceLogRow from "./ServiceLogRow";
import MobileServiceCard from "./MobileServiceCard";
import Pagination from "../Pagination";

interface ServiceLogTableProps {
  /** Paginated slice of logs to display. */
  logs: ServiceLog[];
  /** Total number of filtered results (for pagination). */
  totalResults: number;
  /** Current page (1-based). */
  currentPage: number;
  /** Rows per page. */
  pageSize: number;
  /** Navigate to a page. */
  onPageChange: (page: number) => void;
}

export default function ServiceLogTable({
  logs,
  totalResults,
  currentPage,
  pageSize,
  onPageChange,
}: ServiceLogTableProps) {
  const columns = ["Log ID", "Vehicle", "Issue / Service", "Date", "Cost", "Status", "Actions"];

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {logs.map((log, idx) => (
              <ServiceLogRow
                key={log.id}
                log={log}
                dropUp={idx >= logs.length - 2 && logs.length > 2}
              />
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-40">search_off</span>
                  No service logs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="material-symbols-outlined text-4xl mb-2 block opacity-40">search_off</span>
            No service logs found.
          </div>
        ) : (
          logs.map((log) => <MobileServiceCard key={log.id} log={log} />)
        )}
      </div>

      {/* Pagination */}
      {totalResults > 0 && (
        <div className="border-t border-border-light dark:border-border-dark px-5 py-3">
          <Pagination
            total={totalResults}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            label="results"
          />
        </div>
      )}
    </div>
  );
}
