/**
 * @module drivers/DriverActionMenu
 * Dropdown action menu for a single driver row.
 */

import { driverService } from "../../services";
import { Can } from "../PermissionGate";

interface DriverActionMenuProps {
  /** Driver ID for action callbacks. */
  driverId: string;
  /** Close the dropdown. */
  onClose: () => void;
  /** If true, menu opens upward. */
  dropUp?: boolean;
}

/** Dropdown action menu for a driver. */
export default function DriverActionMenu({ driverId, onClose, dropUp = false }: DriverActionMenuProps) {
  const actions: { icon: string; label: string; handler: () => void; danger?: boolean; permission?: string }[] = [
    { icon: "visibility", label: "View Profile", handler: () => console.log("[DriverAction] View profile:", driverId) },
    { icon: "edit", label: "Edit Driver", handler: () => console.log("[DriverAction] Edit:", driverId), permission: "drivers:edit" },
    { icon: "assignment", label: "View Trips", handler: () => console.log("[DriverAction] View trips:", driverId) },
    { icon: "delete", label: "Remove", handler: () => void driverService.deleteDriver(driverId), danger: true, permission: "drivers:delete" },
  ];

  return (
    <div
      className={`absolute right-0 ${
        dropUp ? "bottom-full mb-1" : "top-full mt-1"
      } w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-40`}
    >
      {actions.map((a) => {
        const btn = (
          <button
            key={a.label}
            onClick={() => {
              a.handler();
              onClose();
            }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
              a.danger
                ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{a.icon}</span>
            {a.label}
          </button>
        );
        return a.permission ? (
          <Can key={a.label} permission={a.permission as import("../../types").Permission}>
            {btn}
          </Can>
        ) : (
          btn
        );
      })}
    </div>
  );
}
