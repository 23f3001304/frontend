/**
 * @module maintenance/ServiceLogActionMenu
 * Per-log action dropdown menu (View, Edit, Print, Delete).
 * Delegates to MaintenanceService for backend operations.
 */

import { maintenanceService } from "../../services";
import { openBlob } from "../../lib/download";
import { Can } from "../PermissionGate";

interface ServiceLogActionMenuProps {
  /** Service log ID for the action. */
  logId: string;
  /** Callback to close the menu. */
  onClose: () => void;
  /** If true, the menu opens upward. */
  dropUp?: boolean;
}

export default function ServiceLogActionMenu({
  logId,
  onClose,
  dropUp = false,
}: ServiceLogActionMenuProps) {
  /** View service log details via MaintenanceService. */
  const handleViewDetails = async () => {
    await maintenanceService.getServiceLogById(logId);
    onClose();
  };

  /** Open edit form via MaintenanceService. */
  const handleEditLog = async () => {
    await maintenanceService.updateServiceLog(logId, {});
    onClose();
  };

  /** Print / preview report via MaintenanceService. */
  const handlePrintReport = async () => {
    const blob = await maintenanceService.printReport(logId);
    openBlob(blob);
    onClose();
  };

  /** Delete service log via MaintenanceService. */
  const handleDeleteLog = async () => {
    await maintenanceService.deleteServiceLog(logId);
    onClose();
  };

  return (
    <div
      className={`absolute right-0 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50 ${
        dropUp ? "bottom-full mb-1" : "mt-1"
      }`}
    >
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={handleViewDetails}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">
          visibility
        </span>
        View Details
      </button>
      <Can permission="maintenance:edit">
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={handleEditLog}
        >
          <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">
            edit
          </span>
          Edit Log
        </button>
      </Can>
      <Can permission="analytics:export">
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={handlePrintReport}
        >
          <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">
            print
          </span>
          Print Report
        </button>
      </Can>
      <div className="border-t border-border-light dark:border-border-dark my-1" />
      <Can permission="maintenance:delete">
        <button
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={handleDeleteLog}
        >
          <span className="material-symbols-outlined text-lg mr-2">delete</span>
          Delete Log
        </button>
      </Can>
    </div>
  );
}
