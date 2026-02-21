/**
 * Reusable skeleton shimmer primitives.
 * Compose these to build loading placeholders for any component.
 */

function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

/* ─── Stats Card Skeleton ─── */
export function StatCardSkeleton() {
  return (
    <div className="bg-surface-light dark:bg-surface-dark overflow-hidden rounded-xl shadow-sm border border-border-light dark:border-border-dark">
      <div className="p-5">
        <div className="flex items-center">
          <Bone className="h-12 w-12 rounded-lg shrink-0" />
          <div className="ml-5 flex-1 space-y-2">
            <Bone className="h-3 w-24" />
            <Bone className="h-7 w-16" />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <Bone className="h-3 w-32" />
      </div>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ─── Fleet Table Skeleton ─── */
function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4"><Bone className="h-4 w-20" /></td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Bone className="h-8 w-8 rounded shrink-0" />
          <div className="ml-3 space-y-1.5">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-3 w-32" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Bone className="h-8 w-8 rounded-full shrink-0" />
          <Bone className="ml-3 h-3.5 w-20" />
        </div>
      </td>
      <td className="px-6 py-4"><Bone className="h-4 w-28" /></td>
      <td className="px-6 py-4"><Bone className="h-4 w-14" /></td>
      <td className="px-6 py-4"><Bone className="h-5 w-16 rounded-full" /></td>
      <td className="px-6 py-4"><Bone className="h-5 w-5 rounded-full ml-auto" /></td>
    </tr>
  );
}

function MobileCardSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Bone className="h-4 w-20" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-3">
        <Bone className="h-8 w-8 rounded shrink-0" />
        <div className="space-y-1.5">
          <Bone className="h-3.5 w-24" />
          <Bone className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Bone className="h-3.5 w-28" />
        <Bone className="h-3.5 w-16" />
      </div>
      <div className="flex items-center gap-2">
        <Bone className="h-6 w-6 rounded-full" />
        <Bone className="h-3 w-20" />
      </div>
    </div>
  );
}

export function FleetTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark shadow-sm rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border-light dark:border-border-dark flex justify-between items-center">
        <Bone className="h-5 w-36" />
        <Bone className="h-4 w-24" />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Bone className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border-light dark:divide-border-dark">
        {Array.from({ length: rows }).map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
        <Bone className="h-4 w-40 hidden sm:block" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bone key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Bottom Widgets Skeleton ─── */
function WidgetCardSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
      {children}
    </div>
  );
}

export function BottomWidgetsSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Vehicle Types */}
      <WidgetCardSkeleton>
        <Bone className="h-3.5 w-24 mb-4" />
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <Bone className="w-2/3 h-2 rounded-full" />
            <Bone className="h-3 w-16" />
          </div>
          <div className="flex items-center space-x-4">
            <Bone className="w-2/3 h-2 rounded-full" />
            <Bone className="h-3 w-14" />
          </div>
        </div>
      </WidgetCardSkeleton>

      {/* Alerts */}
      <WidgetCardSkeleton>
        <Bone className="h-3.5 w-24 mb-4" />
        <div className="space-y-3">
          <div className="flex items-start">
            <Bone className="w-2 h-2 mt-1 mr-2 rounded-full shrink-0" />
            <Bone className="h-3 w-full" />
          </div>
          <div className="flex items-start">
            <Bone className="w-2 h-2 mt-1 mr-2 rounded-full shrink-0" />
            <Bone className="h-3 w-3/4" />
          </div>
        </div>
      </WidgetCardSkeleton>

      {/* Download */}
      <WidgetCardSkeleton>
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <Bone className="h-10 w-10 rounded" />
          <Bone className="h-4 w-36" />
          <Bone className="h-3 w-20" />
        </div>
      </WidgetCardSkeleton>
    </div>
  );
}
