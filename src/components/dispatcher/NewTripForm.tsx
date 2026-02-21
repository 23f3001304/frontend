/**
 * @module dispatcher/NewTripForm
 * Right-column form for creating / dispatching a new trip.
 *
 * Uses LocationInput for origin / destination with Nominatim autocomplete.
 * Displays real distance, duration, and fuel cost from OSRM routing.
 */

import type { Vehicle } from "../../types";
import { useClickPop } from "../../hooks/useGsap";
import { availableDrivers } from "./constants";
import LocationInput, { type LocationValue } from "./LocationInput";
import type { RouteResult } from "../../lib/locationService";
import type { ValidationErrors } from "../../lib/validators";

/* ─── Props ─── */

interface NewTripFormProps {
  /** Currently selected vehicle ID. */
  selectedVehicle: string;
  onSelectedVehicleChange: (v: string) => void;
  /** Cargo weight (string so the input stays controlled). */
  cargoWeight: string;
  onCargoWeightChange: (v: string) => void;
  /** Selected driver ID. */
  selectedDriver: string;
  onSelectedDriverChange: (v: string) => void;
  /** Origin location value (lat/lon + name) or null. */
  origin: LocationValue | null;
  onOriginChange: (v: LocationValue | null) => void;
  /** Destination location value (lat/lon + name) or null. */
  destination: LocationValue | null;
  onDestinationChange: (v: LocationValue | null) => void;
  /** Route calculation result (null while not yet calculated). */
  routeResult: RouteResult | null;
  /** Whether the route is currently being calculated. */
  routeLoading: boolean;
  /** Route error (no route / network). */
  routeError: string | null;
  /** Max load for the currently selected vehicle (0 when none selected). */
  maxLoad: number;
  /** Vehicles available for selection. */
  availableVehicles: Vehicle[];
  /** Current drafting / dispatched status badge. */
  formStatus: "drafting" | "dispatched";
  /** Validation errors map from the parent. */
  formErrors?: ValidationErrors<string>;
  /** Fires when "Save Draft" is clicked. */
  onSaveDraft: () => void;
  /** Fires when "Dispatch Trip" is clicked. */
  onDispatch: () => void;
}

export default function NewTripForm({
  selectedVehicle,
  onSelectedVehicleChange,
  cargoWeight,
  onCargoWeightChange,
  selectedDriver,
  onSelectedDriverChange,
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  routeResult,
  routeLoading,
  routeError,
  maxLoad,
  availableVehicles,
  formStatus,
  formErrors = {},
  onSaveDraft,
  onDispatch,
}: NewTripFormProps) {
  const pop = useClickPop();

  /** Fuel cost display string. */
  const fuelDisplay = routeLoading
    ? "Calculating…"
    : routeResult
      ? `${routeResult.fuelCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      : "0.00";

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
      {/* Form header */}
      <div className="px-5 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">tune</span>
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark">New Trip Form</h3>
        </div>
        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
          formStatus === "drafting"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
        }`}>
          {formStatus === "drafting" ? "Drafting" : "Dispatched!"}
        </span>
      </div>

      {/* Form body */}
      <div className="px-5 py-5 space-y-4">
        {/* Vehicle Select */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
            Select Available Vehicle
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">settings</span>
            </span>
            <select
              value={selectedVehicle}
              onChange={(e) => onSelectedVehicleChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">Choose a vehicle…</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.name} ({v.licensePlate})</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">expand_more</span>
            </span>
          </div>
          {formErrors.vehicle && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.vehicle}</p>}
        </div>

        {/* Cargo Weight */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
            Cargo Weight (kg)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">scale</span>
            </span>
            <input
              type="number"
              value={cargoWeight}
              onChange={(e) => onCargoWeightChange(e.target.value)}
              placeholder="e.g. 2500"
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          {maxLoad > 0 && (
            <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
              Max load for selected: {maxLoad.toLocaleString()} kg
            </p>
          )}
          {formErrors.cargoWeight && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.cargoWeight}</p>}
        </div>

        {/* Driver Select */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
            Select Available Driver
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">person</span>
            </span>
            <select
              value={selectedDriver}
              onChange={(e) => onSelectedDriverChange(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">Choose a driver…</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">expand_more</span>
            </span>
          </div>
          {formErrors.driver && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.driver}</p>}
        </div>

        {/* Origin Address (autocomplete) */}
        <LocationInput
          label="Origin Address"
          icon="trip_origin"
          placeholder="Search pickup location…"
          value={origin}
          onChange={onOriginChange}
          error={formErrors.origin}
        />

        {/* Destination Address (autocomplete) */}
        <LocationInput
          label="Destination Address"
          icon="location_on"
          placeholder="Search delivery location…"
          value={destination}
          onChange={onDestinationChange}
          error={routeError || formErrors.destination}
        />

        {/* Route info strip (distance + duration) */}
        {routeResult && !routeError && (
          <div className="flex items-center gap-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">straighten</span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">{routeResult.distanceKm} km</span>
            </div>
            <div className="h-4 w-px bg-green-300 dark:bg-green-700" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">schedule</span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {routeResult.durationMin >= 60
                  ? `${Math.floor(routeResult.durationMin / 60)}h ${routeResult.durationMin % 60}m`
                  : `${routeResult.durationMin} min`}
              </span>
            </div>
            <div className="h-4 w-px bg-green-300 dark:bg-green-700" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">route</span>
              <span className="text-xs text-green-600 dark:text-green-400">via road</span>
            </div>
          </div>
        )}

        {/* Route loading indicator */}
        {routeLoading && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2.5">
            <span className="material-symbols-outlined text-blue-500 text-lg animate-spin">progress_activity</span>
            <span className="text-sm text-blue-600 dark:text-blue-400">Calculating route…</span>
          </div>
        )}

        {/* Route error banner */}
        {routeError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2.5">
            <span className="material-symbols-outlined text-red-500 text-lg">block</span>
            <span className="text-sm text-red-600 dark:text-red-400">{routeError}</span>
          </div>
        )}

        {/* Estimated Fuel Cost */}
        <div className={`rounded-lg border-2 p-3 ${
          routeError
            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
            : "border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-semibold ${routeError ? "text-red-700 dark:text-red-400" : "text-yellow-700 dark:text-yellow-400"}`}>
              Estimated Fuel Cost
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              routeError
                ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300"
                : routeResult
                  ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300"
                  : "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300"
            }`}>
              {routeError ? "Unavailable" : routeResult ? "OSRM Route" : "Auto-calculated"}
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
              ₹
            </span>
            <input
              type="text"
              value={routeError ? "—" : fuelDisplay}
              readOnly
              className={`block w-full pl-8 pr-4 py-2 border rounded-lg text-sm ${
                routeError
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10 text-red-500"
                  : "border-yellow-300 dark:border-yellow-700 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
              }`}
            />
          </div>
          {routeResult && !routeError && (
            <p className="mt-1.5 text-[11px] text-text-muted-light dark:text-text-muted-dark">
              Based on {routeResult.distanceKm} km × ₹12/km average fleet fuel rate
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onSaveDraft}
            {...pop}
            className="flex-1 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={onDispatch}
            disabled={!!routeError || routeLoading}
            {...pop}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dispatch Trip
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
