/**
 * @module vehicles/VehicleActionMenu
 * Per-vehicle action dropdown menu (View, Edit, Service, Retire).
 * Delegates to FleetService for backend operations.
 */

import { fleetService } from "../../services";

interface VehicleActionMenuProps {
  /** Vehicle ID for the action. */
  vehicleId: string;
  /** Callback to close the menu. */
  onClose: () => void;
  /** If true, the menu opens upward. */
  dropUp?: boolean;
}

/** Per-vehicle action dropdown menu. */
export default function VehicleActionMenu({
  vehicleId,
  onClose,
  dropUp = false,
}: VehicleActionMenuProps) {
  /** View vehicle details via FleetService. */
  const handleViewDetails = () => {
    fleetService.getVehicleById(vehicleId);
    onClose();
  };

  /** Open edit vehicle form via FleetService. */
  const handleEditVehicle = () => {
    fleetService.updateVehicle(vehicleId, {});
    onClose();
  };

  /** Schedule service via FleetService. */
  const handleScheduleService = () => {
    fleetService.scheduleService(vehicleId);
    onClose();
  };

  /** Retire vehicle via FleetService. */
  const handleRetireVehicle = () => {
    fleetService.retireVehicle(vehicleId);
    onClose();
  };

  return (
    <div
      className={`absolute right-0 w-44 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50 ${
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
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={handleEditVehicle}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">
          edit
        </span>
        Edit Vehicle
      </button>
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={handleScheduleService}
      >
        <span className="material-symbols-outlined text-lg mr-2 text-text-muted-light dark:text-text-muted-dark">
          build
        </span>
        Schedule Service
      </button>
      <div className="border-t border-border-light dark:border-border-dark my-1" />
      <button
        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        onClick={handleRetireVehicle}
      >
        <span className="material-symbols-outlined text-lg mr-2">delete</span>
        Retire Vehicle
      </button>
    </div>
  );
}
