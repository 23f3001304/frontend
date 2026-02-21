/**
 * @module TripDispatcher
 * Trip Dispatcher page — create, monitor, and dispatch trips.
 *
 * Layout:
 *  - Breadcrumb navigation (Fleet › Trip Dispatcher).
 *  - Top stats: Draft/Pending, On The Way, Completed Today.
 *  - Left column: Active Trips table with route progress bars.
 *  - Right column: New Trip Form with Nominatim autocomplete + OSRM routing.
 *  - Bottom-right: Vehicle Availability Alert banner.
 *  - GSAP entrance animations consistent with other pages.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import gsap from "gsap";
import { fadeSlideIn, staggerFadeIn } from "../lib/animations";
import { calculateRoute, type RouteResult, type LocationError } from "../lib/locationService";
import { positiveNumber, maxValue, selection, isFormValid, type ValidationErrors } from "../lib/validators";
import { tripService } from "../services";
import { trips as allTrips, vehicles } from "../data";
import {
  DispatcherStat,
  ActiveTripsTable,
  NewTripForm,
  VehicleAlert,
} from "../components/dispatcher";
import type { LocationValue } from "../components/dispatcher";

/* ─── Props ─── */

interface TripDispatcherProps {
  /** Current table page size (driven by settings). */
  pageSize: number;
}

/* ─── Page Component ─── */

export default function TripDispatcher({ pageSize: _pageSize }: TripDispatcherProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ─── Stats ─── */
  const draftCount = useMemo(() => allTrips.filter((t) => t.status === "Loading" || t.status === "Ready").length, []);
  const onTripCount = useMemo(() => allTrips.filter((t) => t.status === "On Trip").length, []);
  const completedToday = 8; // static seed

  /* ─── Form state ─── */
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [origin, setOrigin] = useState<LocationValue | null>(null);
  const [destination, setDestination] = useState<LocationValue | null>(null);
  const [formStatus, setFormStatus] = useState<"drafting" | "dispatched">("drafting");
  const [formErrors, setFormErrors] = useState<ValidationErrors<string>>({});

  /* ─── Route calculation state ─── */
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

  /** Auto-calculate route when both locations are set. */
  useEffect(() => {
    // Both must be valid (have lat/lon)
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

  /* ─── Animations ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (statsRef.current) staggerFadeIn(statsRef.current, ":scope > *", { y: 16, duration: 0.3, delay: 0.05 });
      if (contentRef.current) fadeSlideIn(contentRef.current, "up", { duration: 0.3, delay: 0.12 });
    });
    return () => ctx.revert();
  }, []);

  /* ─── Handlers ─── */

  /** Validate the trip form. Returns errors map. */
  const validateForm = useCallback((): ValidationErrors<string> => {
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

  /** Clear a specific form error when user changes a field. */
  const clearError = useCallback((field: string) => {
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  // Clear errors on field changes
  useEffect(() => { clearError("vehicle"); }, [selectedVehicle, clearError]);
  useEffect(() => { clearError("driver"); }, [selectedDriver, clearError]);
  useEffect(() => { clearError("origin"); }, [origin, clearError]);
  useEffect(() => { clearError("destination"); }, [destination, clearError]);
  useEffect(() => { clearError("cargoWeight"); }, [cargoWeight, clearError]);

  /** [TODO] Connect to backend — save the trip as draft. */
  const handleSaveDraft = useCallback(async () => {
    const errs = validateForm();
    setFormErrors(errs);
    if (!isFormValid(errs)) return;

    const data = {
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
    };
    await tripService.saveDraft(data);
    console.log("[TripDispatcher] Draft saved");
  }, [selectedVehicle, cargoWeight, selectedDriver, origin, destination, routeResult, validateForm]);

  /** [TODO] Connect to backend — dispatch the trip immediately. */
  const handleDispatch = useCallback(async () => {
    const errs = validateForm();
    setFormErrors(errs);
    if (!isFormValid(errs)) return;
    if (routeError || routeLoading) return;

    const data = {
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
    };
    await tripService.createTrip(data);
    setFormStatus("dispatched");
    setTimeout(() => setFormStatus("drafting"), 2000);
  }, [selectedVehicle, cargoWeight, selectedDriver, origin, destination, routeResult, routeError, routeLoading, validateForm]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">Trip Dispatcher</span>
      </nav>

      {/* Title row */}
      <div ref={titleRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
            Trip Dispatcher
          </h2>
          <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
            Create, monitor, and dispatch trips across the fleet.
          </p>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <DispatcherStat icon="drafts" iconColor="text-blue-500" iconBg="bg-blue-100 dark:bg-blue-900/30" label="Draft / Pending" value={draftCount} />
        <DispatcherStat icon="local_shipping" iconColor="text-orange-500" iconBg="bg-orange-100 dark:bg-orange-900/30" label="On The Way" value={onTripCount} />
        <DispatcherStat icon="check_circle" iconColor="text-green-500" iconBg="bg-green-100 dark:bg-green-900/30" label="Completed Today" value={completedToday} />
      </div>

      {/* ─── Main content grid ─── */}
      <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Active Trips (3 cols) */}
        <div className="lg:col-span-3">
          <ActiveTripsTable />
        </div>

        {/* Right: Form + Alert (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <NewTripForm
            selectedVehicle={selectedVehicle}
            onSelectedVehicleChange={setSelectedVehicle}
            cargoWeight={cargoWeight}
            onCargoWeightChange={setCargoWeight}
            selectedDriver={selectedDriver}
            onSelectedDriverChange={setSelectedDriver}
            origin={origin}
            onOriginChange={setOrigin}
            destination={destination}
            onDestinationChange={setDestination}
            routeResult={routeResult}
            routeLoading={routeLoading}
            routeError={routeError}
            maxLoad={maxLoad}
            availableVehicles={availableVehicles}
            formStatus={formStatus}
            formErrors={formErrors}
            onSaveDraft={handleSaveDraft}
            onDispatch={handleDispatch}
          />
          <VehicleAlert availableCount={availableVehicles.length} />
        </div>
      </div>
    </div>
  );
}
