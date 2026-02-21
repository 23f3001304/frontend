/**
 * @module Pagination
 * Shared pagination bar with smart ellipsis for large page counts.
 *
 * Desktop: "Showing X to Y of Z {label}" + page buttons with ellipsis.
 * Mobile:  Previous / {current}/{total} / Next.
 */

/** Props for the shared {@link Pagination} component. */
interface PaginationProps {
  /** Total number of items across all pages. */
  total: number;
  /** The currently active page (1-based). */
  currentPage: number;
  /** Number of items per page. */
  pageSize: number;
  /** Callback when the user navigates to a different page. */
  onPageChange: (page: number) => void;
  /** Label for the total count, e.g. "results" or "vehicles" (default: "results"). */
  label?: string;
}

/**
 * Smart pagination bar with ellipsis for large page counts.
 * Shows "Showing X to Y of Z {label}" on desktop and
 * Previous / Next on mobile.
 */
export default function Pagination({
  total,
  currentPage,
  pageSize,
  onPageChange,
  label = "results",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /** Build display pages: always show current and neighbors, plus first/last. */
  const getDisplayPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const displayPages = getDisplayPages();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
      {/* Mobile */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-border-dark text-sm font-medium rounded-md text-gray-700 dark:text-text-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center text-sm text-text-muted-light dark:text-text-muted-dark">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-border-dark text-sm font-medium rounded-md text-gray-700 dark:text-text-dark bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Showing{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {total > 0 ? startItem : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {endItem}
            </span>{" "}
            of{" "}
            <span className="font-medium text-text-light dark:text-text-dark">
              {total}
            </span>{" "}
            {label}
          </p>
        </div>
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <span className="sr-only">Previous</span>
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          {displayPages.map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                aria-current={page === currentPage ? "page" : undefined}
                className={
                  page === currentPage
                    ? "z-10 bg-primary/10 border-primary text-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                }
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <span className="sr-only">Next</span>
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
