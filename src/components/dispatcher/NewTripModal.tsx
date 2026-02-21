/**
 * @module dispatcher/NewTripModal
 * Self-contained modal for creating / dispatching a new trip.
 * Wraps the location + routing logic and form validation into
 * a single overlay that can be opened from the Header, Trips page, etc.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useClickPop } from "../../hooks/useGsap";
import { calculateRoute, type RouteResult, type LocationError } from "../../lib/locationService";
import { positiveNumber, maxValue, selection, isFormValid, type ValidationErrors } from "../../lib/validators";
import { tripService } from "../../services";
import { vehicles } from "../../data";
import { availableDrivers } from "./constants";
import LocationInput, { type LocationValue } from "./LocationInput";

/* ─── Props ─── */

interface NewTripModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional callback after successful creation. */
  onCreated?: () => void;
}

export default function NewTripModal({ open, onClose, onCreated }: NewTripModalProps) {
  const pop = useClickPop();
  const formRef = useRef<HTMLDivElement>(null);

  /* ─── Form state ─── */
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [origin, setOrigin] = useState<LocationValue | null>(null);
  const [destination, setDestination] = useState<LocationValue | null>(null);
  const [formErrors, setFormErrors] = useState<ValidationErrors<string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ─── Route ─── */
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  /** Available vehicles (status === "Available"). */
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.status === "Available"), []);

  /** Max load for selected vehicle. */
  const maxLoad = useMemo(() => {
    const v = vehicles.find((v) => v.id === selectedVehicle);
    return v ? v.maxCapacity : 0;
  }, [selectedVehicle]);

  /* ─── Auto-calculate route ─── */
  useEffect(() => {
    if (!origin || !destination) {
      setRouteResult(null);
      setRouteError(null);
      return;
    }
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      setRouteLoading(true);
      setRouteError(null);
      setRouteResult(null);
      try {
        const result = await calculateRoute(
          origin.lat, origin.lon,
          destination.lat, destination.lon,
          controller.signal,
        );
        if (!cancelled) setRouteResult(result);
      } catch (err: unknown) {
        if (cancelled || (err as { name?: string }).name === "AbortError") return;
        const locErr = err as LocationError;
        setRouteError(locErr.message ?? "Route calculation failed.");
      } finally {
        if (!cancelled) setRouteLoading(false);
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [origin, destination]);

  /* ─── Reset on open ─── */
  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open]);

  /* ─── Escape key ─── */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* ─── Clear errors on change ─── */
  useEffect(() => { setFormErrors((p) => ({ ...p, vehicle: null })); }, [selectedVehicle]);
  useEffect(() => { setFormErrors((p) => ({ ...p, driver: null })); }, [selectedDriver]);
  useEffect(() => { setFormErrors((p) => ({ ...p, origin: null })); }, [origin]);
  useEffect(() => { setFormErrors((p) => ({ ...p, destination: null })); }, [destination]);
  useEffect(() => { setFormErrors((p) => ({ ...p, cargoWeight: null })); }, [cargoWeight]);

  /* ─── Validation ─── */
  const validate = useCallback((): ValidationErrors<string> => {
    const errs: ValidationErrors<string> = {};
    errs.vehicle = selection(selectedVehicle, "Vehicle");
    errs.driver = selection(selectedDriver, "Driver");
    errs.origin = origin ? null : "Origin is required";
    errs.destination = destination ? null : "Destination is required";
    if (cargoWeight.trim()) {
      errs.cargoWeight = positiveNumber(cargoWeight, "Cargo weight");
      if (!errs.cargoWeight && maxLoad > 0) {
        errs.cargoWeight = maxValue(cargoWeight, maxLoad, "Cargo weight");
      }
    }
    return errs;
  }, [selectedVehicle, selectedDriver, origin, destination, cargoWeight, maxLoad]);

  const buildPayload = useCallback(() => ({
    vehicleId: selectedVehicle,
    driverId: selectedDriver,
    originName: origin!.name,
    originLat: origin!.lat,
    originLon: origin!.lon,
    destinationName: destination!.name,
    destinationLat: destination!.lat,
    destinationLon: destination!.lon,
    cargoWeightKg: Number(cargoWeight) || 0,
    distanceKm: routeResult?.distanceKm ?? 0,
    durationMin: routeResult?.durationMin ?? 0,
    fuelCost: routeResult?.fuelCost ?? 0,
  }), [selectedVehicle, selectedDriver, origin, destination, cargoWeight, routeResult]);

  /* ─── Handlers ─── */
  const handleSaveDraft = useCallback(async () => {
    const errs = validate();
    setFormErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      await tripService.saveDraft(buildPayload());
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        resetAndClose();
      }, 1200);
    } catch (err) {
      console.error("[NewTripModal] Save draft failed:", err);
    } finally {
      setSubmitting(false);
    }
  }, [validate, buildPayload, onCreated]);

  const handleDispatch = useCallback(async () => {
    const errs = validate();
    setFormErrors(errs);
    if (!isFormValid(errs)) return;
    if (routeError || routeLoading) return;

    setSubmitting(true);
    try {
      await tripService.createTrip(buildPayload());
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        resetAndClose();
      }, 1200);
    } catch (err) {
      console.error("[NewTripModal] Dispatch failed:", err);
    } finally {
      setSubmitting(false);
    }
  }, [validate, buildPayload, routeError, routeLoading, onCreated]);

  const resetAndClose = useCallback(() => {
    setSelectedVehicle("");
    setCargoWeight("");
    setSelectedDriver("");
    setOrigin(null);
    setDestination(null);
    setFormErrors({});
    setRouteResult(null);
    setRouteError(null);
    setSubmitted(false);
    onClose();
  }, [onClose]);

  /** Fuel cost display string. */
  const fuelDisplay = routeLoading
    ? "Calculating…"
    : routeResult
      ? `₹${routeResult.fuelCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
      : "—";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetAndClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark">
        {/* Header */}
        <div className="sticky top-0 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">alt_route</span>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">New Trip</h3>
          </div>
          <button onClick={resetAndClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">close</span>
          </button>
        </div>

        {/* Body */}
        <div ref={formRef} className="px-6 py-5 space-y-4">
          {/* Vehicle Select */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              Select Vehicle
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">settings</span>
              </span>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-1 appearance-none transition ${
                  formErrors.vehicle
                    ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                    : "border-border-light dark:border-border-dark focus:ring-primary focus:border-primary"
                }`}
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

          {/* Driver Select */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              Select Driver
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg">person</span>
              </span>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark text-sm focus:outline-none focus:ring-1 appearance-none transition ${
                  formErrors.driver
                    ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                    : "border-border-light dark:border-border-dark focus:ring-primary focus:border-primary"
                }`}
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
                onChange={(e) => setCargoWeight(e.target.value)}
                placeholder="e.g. 2500"
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark text-sm focus:outline-none focus:ring-1 transition ${
                  formErrors.cargoWeight
                    ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                    : "border-border-light dark:border-border-dark focus:ring-primary focus:border-primary"
                }`}
              />
            </div>
            {maxLoad > 0 && (
              <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                Max load for selected: {maxLoad.toLocaleString()} kg
              </p>
            )}
            {formErrors.cargoWeight && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{formErrors.cargoWeight}</p>}
          </div>

          {/* Origin */}
          <LocationInput
            label="Origin Address"
            icon="trip_origin"
            placeholder="Search pickup location…"
            value={origin}
            onChange={setOrigin}
            error={formErrors.origin}
          />

          {/* Destination */}
          <LocationInput
            label="Destination Address"
            icon="location_on"
            placeholder="Search delivery location…"
            value={destination}
            onChange={setDestination}
            error={routeError || formErrors.destination}
          />

          {/* Route info strip */}
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
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg">local_gas_station</span>
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">{fuelDisplay}</span>
              </div>
            </div>
          )}

          {/* Route loading */}
          {routeLoading && (
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2.5">
              <span className="material-symbols-outlined text-blue-500 text-lg animate-spin">progress_activity</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">Calculating route…</span>
            </div>
          )}

          {/* Route error */}
          {routeError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2.5">
              <span className="material-symbols-outlined text-red-500 text-lg">block</span>
              <span className="text-sm text-red-600 dark:text-red-400">{routeError}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark px-6 py-4 flex items-center gap-3 rounded-b-2xl">
          <button
            onClick={handleSaveDraft}
            disabled={submitting || submitted}
            className="flex-1 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
          <button
            onClick={handleDispatch}
            disabled={submitting || submitted || !!routeError || routeLoading}
            {...pop}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Trip Created!
              </>
            ) : submitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Creating…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">send</span>
                Dispatch Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
