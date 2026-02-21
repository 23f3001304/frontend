/**
 * @module maintenance/MobileServiceCard
 * Mobile-friendly card layout for a single service log entry.
 */

import { useState, useRef, useEffect } from "react";
import type { ServiceLog } from "./constants";
import { statusStyles } from "./constants";
import ServiceLogActionMenu from "./ServiceLogActionMenu";

interface MobileServiceCardProps {
  log: ServiceLog;
}

export default function MobileServiceCard({ log }: MobileServiceCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{log.id}</span>
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[log.status]}`}>
            {log.status}
          </span>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl">
                more_vert
              </span>
            </button>
            {menuOpen && (
              <ServiceLogActionMenu logId={log.id} onClose={() => setMenuOpen(false)} />
            )}
          </div>
        </div>
      </div>

      {/* Vehicle info */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">
            {log.vehicle.icon}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-text-light dark:text-text-dark">{log.vehicle.name}</p>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{log.vehicle.licensePlate}</p>
        </div>
      </div>

      {/* Issue */}
      <div>
        <p className="text-sm font-medium text-text-light dark:text-text-dark">{log.issue}</p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{log.serviceType}</p>
      </div>

      {/* Date + Cost */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted-light dark:text-text-muted-dark">{log.date}</span>
        <span className="font-semibold text-text-light dark:text-text-dark">₹{log.cost.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
