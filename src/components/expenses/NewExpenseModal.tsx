/**
 * @module expenses/NewExpenseModal
 * Modal for adding a new expense record.
 * Includes client-side validation and calls ExpenseService.
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useClickPop } from "../../hooks/useGsap";
import { expenseService } from "../../services";
import {
  required,
  positiveNumber,
  nonNegativeNumber,
  isFormValid,
  type ValidationErrors,
} from "../../lib/validators";

/* ─── Form Fields ─── */

type FormField = "driverName" | "vehicle" | "distance" | "fuelExpense" | "miscExpense";

interface NewExpenseModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional callback after successful submission. */
  onCreated?: () => void;
}

/** Generate 2-letter initials from a name. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-pink-400", "bg-purple-400", "bg-teal-400",
  "bg-orange-400", "bg-indigo-400", "bg-emerald-500", "bg-rose-400",
  "bg-cyan-400", "bg-amber-500", "bg-lime-500", "bg-gray-400",
];

export default function NewExpenseModal({ open, onClose, onCreated }: NewExpenseModalProps) {
  const pop = useClickPop();
  const driverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    driverName: "",
    vehicle: "",
    distance: "",
    fuelExpense: "",
    miscExpense: "",
  });

  const [errors, setErrors] = useState<ValidationErrors<FormField>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Focus driver name on open
  useEffect(() => {
    if (open) {
      setTimeout(() => driverRef.current?.focus(), 100);
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
      driverName: required(form.driverName, "Driver name"),
      vehicle: required(form.vehicle, "Vehicle"),
      distance: positiveNumber(form.distance, "Distance"),
      fuelExpense: positiveNumber(form.fuelExpense, "Fuel expense"),
      miscExpense: nonNegativeNumber(form.miscExpense, "Misc. expense"),
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const errs = validate();
    setErrors(errs);
    if (!isFormValid(errs)) return;

    setSubmitting(true);
    try {
      const colorIdx = Math.floor(Math.random() * AVATAR_COLORS.length);
      await expenseService.createExpense({
        driverName: form.driverName.trim(),
        driverInitials: getInitials(form.driverName),
        driverAvatarColor: AVATAR_COLORS[colorIdx],
        vehicle: form.vehicle.trim(),
        distance: Number(form.distance),
        fuelExpense: Number(form.fuelExpense),
        miscExpense: Number(form.miscExpense) || 0,
      });
      setSubmitted(true);
      setTimeout(() => {
        onCreated?.();
        onClose();
        setForm({ driverName: "", vehicle: "", distance: "", fuelExpense: "", miscExpense: "" });
        setErrors({});
        setSubmitted(false);
      }, 1200);
    } catch (err) {
      console.error("[NewExpenseModal] Submit failed:", err);
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
            <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Add an Expense</h3>
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
              ref={driverRef}
              type="text"
              value={form.driverName}
              onChange={(e) => updateField("driverName", e.target.value)}
              placeholder="e.g. John Doe"
              className={inputClass(errors.driverName)}
            />
            {errors.driverName && <p className="mt-1 text-xs text-red-500">{errors.driverName}</p>}
          </div>

          {/* Vehicle */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Vehicle</label>
            <input
              type="text"
              value={form.vehicle}
              onChange={(e) => updateField("vehicle", e.target.value)}
              placeholder="e.g. Volvo FH16"
              className={inputClass(errors.vehicle)}
            />
            {errors.vehicle && <p className="mt-1 text-xs text-red-500">{errors.vehicle}</p>}
          </div>

          {/* Distance + Fuel Expense (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Distance (km)</label>
              <input
                type="number"
                value={form.distance}
                onChange={(e) => updateField("distance", e.target.value)}
                placeholder="e.g. 1000"
                className={inputClass(errors.distance)}
              />
              {errors.distance && <p className="mt-1 text-xs text-red-500">{errors.distance}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Fuel Expense ($)</label>
              <input
                type="number"
                value={form.fuelExpense}
                onChange={(e) => updateField("fuelExpense", e.target.value)}
                placeholder="e.g. 19000"
                className={inputClass(errors.fuelExpense)}
              />
              {errors.fuelExpense && <p className="mt-1 text-xs text-red-500">{errors.fuelExpense}</p>}
            </div>
          </div>

          {/* Misc. Expense */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Misc. Expense ($)</label>
            <input
              type="number"
              value={form.miscExpense}
              onChange={(e) => updateField("miscExpense", e.target.value)}
              placeholder="e.g. 3000"
              className={inputClass(errors.miscExpense)}
            />
            {errors.miscExpense && <p className="mt-1 text-xs text-red-500">{errors.miscExpense}</p>}
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
                Expense Added
              </>
            ) : submitting ? (
              "Saving…"
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">add</span>
                Add Expense
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
