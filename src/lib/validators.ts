/**
 * @module lib/validators
 * Shared form validation utilities.
 *
 * Each validator returns `null` on success, or an error message string on failure.
 * Compose validators with `runValidators()` to check a full form.
 */

/* ─── Primitive Validators ─── */

/** Value must not be empty (after trimming). */
export function required(value: string, fieldName = "This field"): string | null {
  return value.trim() ? null : `${fieldName} is required`;
}

/** Value must be a positive number. */
export function positiveNumber(value: string, fieldName = "Value"): string | null {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return `${fieldName} must be a positive number`;
  return null;
}

/** Value must be a non-negative number (zero allowed). */
export function nonNegativeNumber(value: string, fieldName = "Value"): string | null {
  const n = Number(value);
  if (isNaN(n) || n < 0) return `${fieldName} must be a non-negative number`;
  return null;
}

/** Value must not exceed a maximum. */
export function maxValue(value: string, max: number, fieldName = "Value"): string | null {
  const n = Number(value);
  if (isNaN(n)) return `${fieldName} must be a valid number`;
  if (n > max) return `${fieldName} must not exceed ${max.toLocaleString()}`;
  return null;
}

/** Value must have a minimum length. */
export function minLength(value: string, min: number, fieldName = "Value"): string | null {
  if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
  return null;
}

/** Simple license plate pattern: at least 4 alphanumeric chars with spaces/hyphens. */
export function licensePlate(value: string): string | null {
  const cleaned = value.replace(/[\s-]/g, "");
  if (cleaned.length < 4) return "License plate must be at least 4 characters";
  if (!/^[A-Za-z0-9]+$/.test(cleaned)) return "License plate must contain only letters, numbers, spaces, and hyphens";
  return null;
}

/** Value must be a valid year between min and max. */
export function year(value: string, min = 1990, max = new Date().getFullYear() + 1): string | null {
  const n = Number(value);
  if (isNaN(n) || !Number.isInteger(n)) return "Year must be a whole number";
  if (n < min || n > max) return `Year must be between ${min} and ${max}`;
  return null;
}

/** Value must be selected from a list (non-empty string). */
export function selection(value: string, fieldName = "Selection"): string | null {
  return value ? null : `${fieldName} is required`;
}

/* ─── Form-level helpers ─── */

/** A map of field names → error messages (or null/undefined if valid). */
export type ValidationErrors<T extends string = string> = Partial<Record<T, string | null>>;

/**
 * Check if there are any errors in a validation result.
 * Returns true if the form is valid (no errors).
 */
export function isFormValid<T extends string>(errors: ValidationErrors<T>): boolean {
  return Object.values(errors).every((v) => v === null || v === undefined);
}
