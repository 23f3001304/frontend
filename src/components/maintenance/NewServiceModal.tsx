/**
 * @module maintenance/NewServiceModal
 * Modal form for creating a new service / maintenance log entry.
 * Includes client-side validation and calls MaintenanceService.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useClickPop } from "../../hooks/useGsap";
import { maintenanceService } from "../../services";
import type { ServiceStatus } from "./constants";
import { required, positiveNumber, selection, isFormValid, type ValidationErrors } from "../../lib/validators";

/* ─── Constants ─── */

const STATUS_OPTIONS: ServiceStatus[] = ["New", "In Shop", "Completed", "Cancelled"];

const COMMON_ISSUES = [
  "Routine Maintenance",
  "Engine Overheating",
  "Brake Failure",
  "Transmission Repair",
  "Electrical Fault",
  "Suspension Damage",
  "AC Malfunction",
  "Tyre Puncture",
  "Oil Leak",
  "Battery Dead",
];

/* ─── Form Fields ─── */

type FormField = "vehicleName" | "licensePlate" | "issue" | "serviceType" | "date" | "cost" | "status";

interface NewServiceModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function NewServiceModal({ open, onClose, onCreated }: NewServiceModalProps) {
  const pop = useClickPop();
  const vehicleRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    vehicleName: "",
    licensePlate: "",
    vehicleIcon: "local_shipping",
    issue: "",
    serviceType: "",
    date: new Date().toISOString().split("T")[0],
    cost: "",
    status: "New" as ServiceStatus,
  });

  const [errors, setErrors] = useState<ValidationErrors<FormField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => vehicleRef.current?.focus(), 100);
      setSubmitted(false);
    }
  }, [open]);

  const updateField = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  const validate = useCallback((): ValidationErrors<FormField> => {
    return {
      vehicleName: required(form.vehicleName, "Vehicle name"),
      licensePlate: required(form.licensePlate, "License plate"),
      issue: required(form.issue, "Issue"),
      serviceType: required(form.serviceType, "Service type"),
      date: required(form.date, "Date"),
      cost: positiveNumber(form.cost, "Cost"),
      status: selection(form.status, "Status"),
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      // Format date for display
      const dateObj = new Date(form.date + "T00:00:00");
      const formatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      await maintenanceService.createServiceLog({
        vehicleName: form.vehicleName.trim(),
        vehicleLicensePlate: form.licensePlate.trim().toUpperCase(),
        vehicleIcon: form.vehicleIcon,
        issue: form.issue.trim(),
        serviceType: form.serviceType.trim(),
        date: formatted,
        cost: Number(form.cost),
        status: form.status,
      });
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        onClose();
        setForm({
          vehicleName: "", licensePlate: "", vehicleIcon: "local_shipping",
          issue: "", serviceType: "", date: new Date().toISOString().split("T")[0],
          cost: "", status: "New",
        });
        setErrors({});
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error("[NewServiceModal] Submit failed:", err);
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
            <span className="material-symbols-outlined text-primary text-xl">build</span>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Create New Service</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Vehicle Name + License Plate */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Vehicle Name" error={errors.vehicleName}>
              <input
                ref={vehicleRef}
                type="text"
                value={form.vehicleName}
                onChange={(e) => updateField("vehicleName", e.target.value)}
                placeholder="e.g. TATA Prima"
                className={inputClass(errors.vehicleName)}
              />
            </Field>

            <Field label="License Plate" error={errors.licensePlate}>
              <input
                type="text"
                value={form.licensePlate}
                onChange={(e) => updateField("licensePlate", e.target.value)}
                placeholder="e.g. MH 12 AB 1234"
                className={inputClass(errors.licensePlate)}
              />
            </Field>
          </div>

          {/* Issue / Problem */}
          <Field label="Issue / Problem" error={errors.issue}>
            <input
              type="text"
              value={form.issue}
              onChange={(e) => updateField("issue", e.target.value)}
              placeholder="e.g. Engine Overheating"
              list="issue-suggestions"
              className={inputClass(errors.issue)}
            />
            <datalist id="issue-suggestions">
              {COMMON_ISSUES.map((i) => <option key={i} value={i} />)}
            </datalist>
          </Field>

          {/* Service Type */}
          <Field label="Service Type / Description" error={errors.serviceType}>
            <input
              type="text"
              value={form.serviceType}
              onChange={(e) => updateField("serviceType", e.target.value)}
              placeholder="e.g. Diagnostic Check"
              className={inputClass(errors.serviceType)}
            />
          </Field>

          {/* Date + Cost */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Service Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className={inputClass(errors.date)}
              />
            </Field>

            <Field label="Cost (₹)" error={errors.cost}>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm text-text-muted-light dark:text-text-muted-dark">₹</span>
                <input
                  type="number"
                  value={form.cost}
                  onChange={(e) => updateField("cost", e.target.value)}
                  placeholder="e.g. 10500"
                  className={`${inputClass(errors.cost)} pl-8`}
                />
              </div>
            </Field>
          </div>

          {/* Status */}
          <Field label="Status" error={errors.status}>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateField("status", s)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    form.status === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {s}
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
                Service Created!
              </>
            ) : submitting ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Saving…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Create Service
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
