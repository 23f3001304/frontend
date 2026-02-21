/**
 * @module vehicles/NewVehicleModal
 * Slide-over modal for adding a new vehicle to the fleet.
 * Includes client-side validation and calls FleetService.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { VehicleCategory } from "../../types";
import { useClickPop } from "../../hooks/useGsap";
import { fleetService } from "../../services";
import { required, positiveNumber, year as yearValidator, licensePlate as lpValidator, maxValue, selection, isFormValid, type ValidationErrors } from "../../lib/validators";

/* ─── Constants ─── */

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  "Box Truck", "Cargo Van", "Semi-Trailer", "Electric Bike",
  "Pickup Truck", "Flatbed", "Refrigerated",
];

const VEHICLE_ICONS: { value: string; label: string }[] = [
  { value: "local_shipping", label: "Truck" },
  { value: "airport_shuttle", label: "Van" },
  { value: "rv_hookup", label: "Flatbed" },
  { value: "ac_unit", label: "Refrigerated" },
  { value: "electric_bike", label: "E-Bike" },
  { value: "directions_car", label: "Car" },
];

/* ─── Form Fields ─── */

type FormField = "name" | "category" | "year" | "licensePlate" | "maxCapacity" | "odometer" | "icon";

interface NewVehicleModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional callback after successful submission. */
  onCreated?: () => void;
}

export default function NewVehicleModal({ open, onClose, onCreated }: NewVehicleModalProps) {
  const pop = useClickPop();
  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    category: "" as VehicleCategory | "",
    year: "",
    licensePlate: "",
    maxCapacity: "",
    odometer: "",
    icon: "local_shipping",
  });

  const [errors, setErrors] = useState<ValidationErrors<FormField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Focus name on open
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 100);
      setSubmitted(false);
    }
  }, [open]);

  const updateField = useCallback((field: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  /** Validate all fields and return errors map. */
  const validate = useCallback((): ValidationErrors<FormField> => {
    return {
      name: required(form.name, "Vehicle name"),
      category: selection(form.category, "Category"),
      year: yearValidator(form.year),
      licensePlate: form.licensePlate.trim() ? lpValidator(form.licensePlate) : required(form.licensePlate, "License plate"),
      maxCapacity: positiveNumber(form.maxCapacity, "Max capacity"),
      odometer: form.odometer.trim() ? maxValue(form.odometer, 999999, "Odometer") : null,
      icon: selection(form.icon, "Icon"),
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      await fleetService.createVehicle({
        name: form.name.trim(),
        category: form.category as VehicleCategory,
        year: Number(form.year),
        licensePlate: form.licensePlate.trim().toUpperCase(),
        maxCapacity: Number(form.maxCapacity),
        odometer: Number(form.odometer) || 0,
        icon: form.icon,
      });
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        onClose();
        // Reset form
        setForm({ name: "", category: "", year: "", licensePlate: "", maxCapacity: "", odometer: "", icon: "local_shipping" });
        setErrors({});
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error("[NewVehicleModal] Submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  }, [form, validate, onClose, onCreated]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark">
        {/* Header */}
        <div className="sticky top-0 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">directions_car</span>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Add New Vehicle</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Vehicle Name */}
          <Field label="Vehicle Name" error={errors.name}>
            <input
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Freightliner M2 106"
              className={inputClass(errors.name)}
            />
          </Field>

          {/* Category + Year (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" error={errors.category}>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={selectClass(errors.category)}
              >
                <option value="">Select…</option>
                {VEHICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Year" error={errors.year}>
              <input
                type="number"
                value={form.year}
                onChange={(e) => updateField("year", e.target.value)}
                placeholder="e.g. 2024"
                className={inputClass(errors.year)}
              />
            </Field>
          </div>

          {/* License Plate */}
          <Field label="License Plate" error={errors.licensePlate}>
            <input
              type="text"
              value={form.licensePlate}
              onChange={(e) => updateField("licensePlate", e.target.value)}
              placeholder="e.g. MH 12 AB 1234"
              className={inputClass(errors.licensePlate)}
            />
          </Field>

          {/* Max Capacity + Odometer */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Max Capacity (lbs)" error={errors.maxCapacity}>
              <input
                type="number"
                value={form.maxCapacity}
                onChange={(e) => updateField("maxCapacity", e.target.value)}
                placeholder="e.g. 26000"
                className={inputClass(errors.maxCapacity)}
              />
            </Field>

            <Field label="Odometer (miles)" error={errors.odometer}>
              <input
                type="number"
                value={form.odometer}
                onChange={(e) => updateField("odometer", e.target.value)}
                placeholder="e.g. 45000"
                className={inputClass(errors.odometer)}
              />
            </Field>
          </div>

          {/* Vehicle Icon */}
          <Field label="Vehicle Icon" error={errors.icon}>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_ICONS.map((ic) => (
                <button
                  key={ic.value}
                  type="button"
                  onClick={() => updateField("icon", ic.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    form.icon === ic.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{ic.value}</span>
                  {ic.label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark px-6 py-4 flex items-center gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            {...pop}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Vehicle Added!
              </>
            ) : submitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add Vehicle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─── */

function Field({ label, error, children }: { label: string; error?: string | null; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

function inputClass(error?: string | null) {
  const base = "block w-full px-4 py-2.5 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark text-sm focus:outline-none focus:ring-1 transition";
  return error
    ? `${base} border-red-400 dark:border-red-500 focus:ring-red-400 focus:border-red-400`
    : `${base} border-border-light dark:border-border-dark focus:ring-primary focus:border-primary`;
}

function selectClass(error?: string | null) {
  return `${inputClass(error)} appearance-none`;
}
