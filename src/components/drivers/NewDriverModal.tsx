/**
 * @module drivers/NewDriverModal
 * Slide-over modal for adding a new driver.
 * Includes client-side validation and calls DriverService.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useClickPop } from "../../hooks/useGsap";
import { driverService } from "../../services";
import {
  required,
  minLength,
  licensePlate as lpValidator,
  isFormValid,
  type ValidationErrors,
} from "../../lib/validators";

/* ─── Form Fields ─── */

type FormField = "name" | "licenseNumber" | "licenseExpiry";

interface NewDriverModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional callback after successful submission. */
  onCreated?: () => void;
}

export default function NewDriverModal({ open, onClose, onCreated }: NewDriverModalProps) {
  const pop = useClickPop();
  const nameRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    licenseNumber: "",
    licenseExpiry: "",
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
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  /** Validate all fields and return errors map. */
  const validate = useCallback((): ValidationErrors<FormField> => {
    return {
      name: required(form.name, "Driver name") ?? minLength(form.name, 2, "Driver name"),
      licenseNumber: required(form.licenseNumber, "License number") ?? lpValidator(form.licenseNumber),
      licenseExpiry: required(form.licenseExpiry, "License expiry"),
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      await driverService.createDriver({
        name: form.name.trim(),
        licenseNumber: form.licenseNumber.trim().toUpperCase(),
        licenseExpiry: form.licenseExpiry.trim(),
        completionRate: 0,
        safetyScore: 100,
        complaints: 0,
        dutyStatus: "On Duty",
      });
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        onClose();
        setForm({ name: "", licenseNumber: "", licenseExpiry: "" });
        setErrors({});
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error("[NewDriverModal] Submit failed:", err);
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

  const inputClass = (err: string | null | undefined) =>
    `block w-full px-3 py-2.5 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition ${
      err ? "border-red-400 dark:border-red-500" : "border-border-light dark:border-border-dark"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark">
        {/* Header */}
        <div className="sticky top-0 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">person_add</span>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Add Driver</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Driver Name */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Driver Name</label>
            <input
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. John Smith"
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">License Number</label>
            <input
              type="text"
              value={form.licenseNumber}
              onChange={(e) => updateField("licenseNumber", e.target.value)}
              placeholder="e.g. DL-23223"
              className={inputClass(errors.licenseNumber)}
            />
            {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber}</p>}
          </div>

          {/* License Expiry */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">License Expiry</label>
            <input
              type="text"
              value={form.licenseExpiry}
              onChange={(e) => updateField("licenseExpiry", e.target.value)}
              placeholder="e.g. 22 Dec 2036"
              className={inputClass(errors.licenseExpiry)}
            />
            {errors.licenseExpiry && <p className="mt-1 text-xs text-red-500">{errors.licenseExpiry}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            {...pop}
            className={`px-5 py-2 text-sm font-medium rounded-lg text-white transition-colors flex items-center gap-2 ${
              submitted
                ? "bg-green-500"
                : submitting
                  ? "bg-primary/70 cursor-wait"
                  : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {submitted ? (
              <>
                <span className="material-symbols-outlined text-lg">check_circle</span>
                Driver Added
              </>
            ) : submitting ? (
              "Saving…"
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">person_add</span>
                Add Driver
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
