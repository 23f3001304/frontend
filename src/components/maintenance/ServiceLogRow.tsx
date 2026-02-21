/**
 * @module maintenance/ServiceLogRow
 * A single row inside the service logs desktop table.
 */

import { useState, useRef, useEffect } from "react";
import type { ServiceLog } from "./constants";
import { statusStyles } from "./constants";
import ServiceLogActionMenu from "./ServiceLogActionMenu";

interface ServiceLogRowProps {
  log: ServiceLog;
  /** Whether this row is near the bottom — opens menu upward. */
  dropUp?: boolean;
}

export default function ServiceLogRow({ log, dropUp = false }: ServiceLogRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Log ID */}
      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-primary">
        {log.id}
      </td>

      {/* Vehicle */}
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">
              {log.vehicle.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-light dark:text-text-dark">{log.vehicle.name}</p>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{log.vehicle.licensePlate}</p>
          </div>
        </div>
      </td>

      {/* Issue / Service */}
      <td className="px-5 py-4 whitespace-nowrap">
        <p className="text-sm font-medium text-text-light dark:text-text-dark">{log.issue}</p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{log.serviceType}</p>
      </td>

      {/* Date */}
      <td className="px-5 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
        {log.date}
      </td>

      {/* Cost */}
      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-text-light dark:text-text-dark">
        ₹{log.cost.toLocaleString("en-IN")}
      </td>

      {/* Status */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[log.status]}`}>
          {log.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 whitespace-nowrap text-right">
        <div ref={menuRef} className="relative inline-block">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl">
              more_vert
            </span>
          </button>
          {menuOpen && (
            <ServiceLogActionMenu
              logId={log.id}
              onClose={() => setMenuOpen(false)}
              dropUp={dropUp}
            />
          )}
        </div>
      </td>
    </tr>
  );
}
