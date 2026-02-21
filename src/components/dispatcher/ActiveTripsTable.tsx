/**
 * @module dispatcher/ActiveTripsTable
 * Table of currently active trips with route info and progress bars.
 */

import { useNavigate } from "react-router-dom";
import { useClickPop } from "../../hooks/useGsap";
import {
  vehicleTypeIcon,
  vehicleTypeBgColor,
  progressColor,
  activeTrips,
} from "./constants";

export default function ActiveTripsTable() {
  const pop = useClickPop();
  const navigate = useNavigate();

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">list_alt</span>
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Active Trips</h3>
        </div>
        <button
          onClick={() => navigate("/trips")}
          {...pop}
          className="text-sm text-primary hover:text-primary-hover font-medium"
        >
          View All History
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Trip ID", "Vehicle Type", "Route", "Progress"].map((col) => (
                <th key={col} scope="col" className="px-5 py-3 text-left text-xs font-medium text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-light dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark">
            {activeTrips.map((trip) => (
              <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                  {trip.id}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${vehicleTypeBgColor[trip.vehicleType]}`}>
                    <span className="material-symbols-outlined text-sm">{vehicleTypeIcon[trip.vehicleType]}</span>
                    {trip.vehicleType}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-light dark:text-text-dark">
                    {trip.from} <span className="text-gray-400 mx-1">→</span> {trip.to}
                  </div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">{trip.subtitle}</div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="w-28">
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${progressColor[trip.progressStatus]}`}
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
