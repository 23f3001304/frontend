/**
 * @module dispatcher/VehicleAlert
 * Yellow banner warning about low vehicle availability in the depot.
 */

interface VehicleAlertProps {
  /** Number of vehicles currently available. */
  availableCount: number;
}

export default function VehicleAlert({ availableCount }: VehicleAlertProps) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-xl mt-0.5">warning</span>
        <div>
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Vehicle Availability Alert</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            Only {availableCount} vehicles are available in the depot. Consider routing pending deliveries through alternate hubs.
          </p>
        </div>
      </div>
    </div>
  );
}
