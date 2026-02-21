/**
 * @module dispatcher/LocationInput
 * Autocomplete input powered by Nominatim geocoding.
 *
 * Features:
 *  - Debounced search (400 ms) as the user types.
 *  - Dropdown with up to 5 suggestions.
 *  - Keyboard navigation (↑ ↓ Enter Escape).
 *  - Error / invalid state when no results are found.
 *  - Stores lat/lon of the selected place for routing.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { searchLocations, type LocationSuggestion, type LocationError } from "../../lib/locationService";

/* ─── Exported location value ─── */

/** Structured location chosen by the user. */
export interface LocationValue {
  /** Display name. */
  name: string;
  lat: number;
  lon: number;
}

/* ─── Props ─── */

interface LocationInputProps {
  /** Label displayed above the input. */
  label: string;
  /** Material Symbols icon name for the left adornment. */
  icon: string;
  /** Placeholder text. */
  placeholder: string;
  /** Current location value (controlled). */
  value: LocationValue | null;
  /** Fires when the user picks a suggestion or clears the field. */
  onChange: (v: LocationValue | null) => void;
  /** Optional external error message (e.g. "No route found"). */
  error?: string | null;
}

/* ─── Component ─── */

export default function LocationInput({
  label,
  icon,
  placeholder,
  value,
  onChange,
  error: externalError,
}: LocationInputProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(100);

  // Keep input text in sync when parent resets value
  useEffect(() => {
    if (value) setQuery(value.name);
  }, [value]);

  /** Debounced Nominatim search. */
  const doSearch = useCallback((q: string) => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setInternalError(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setInternalError(null);
      try {
        const results = await searchLocations(q, 5, controller.signal);
        if (results.length === 0) {
          setInternalError("Location not found — try a different search.");
          setSuggestions([]);
        } else {
          setSuggestions(results);
        }
        setIsOpen(true);
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "AbortError") return;
        const locErr = err as LocationError;
        setInternalError(locErr.message ?? "Search failed. Check your connection.");
        setSuggestions([]);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, []);

  /** Handle text change. */
  const handleChange = (text: string) => {
    setQuery(text);
    setActiveIdx(-1);
    // If user edits after picking, clear the structured value
    if (value) onChange(null);
    doSearch(text);
  };

  /** Pick a suggestion. */
  const pickSuggestion = (s: LocationSuggestion) => {
    // Shorten the display name: take first 2 comma-separated parts
    const short = s.displayName.split(",").slice(0, 3).map((p) => p.trim()).join(", ");
    setQuery(short);
    onChange({ name: short, lat: s.lat, lon: s.lon });
    setIsOpen(false);
    setSuggestions([]);
    setInternalError(null);
    inputRef.current?.blur();
  };

  /** Keyboard navigation. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Escape") { setIsOpen(false); inputRef.current?.blur(); }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIdx >= 0 && activeIdx < suggestions.length) {
          pickSuggestion(suggestions[activeIdx]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  /** Close dropdown on outside click. */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayError = externalError ?? internalError;
  const hasError = !!displayError;
  const isValid = !!value && !hasError;

  const borderClass = hasError
    ? "border-red-400 dark:border-red-500 focus-within:ring-red-400"
    : isValid
      ? "border-green-400 dark:border-green-500 focus-within:ring-green-400"
      : "border-border-light dark:border-border-dark focus-within:ring-primary";

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
        {label}
      </label>

      {/* Input row */}
      <div className={`relative rounded-lg border ${borderClass} transition-colors focus-within:ring-1`}>
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className={`material-symbols-outlined text-lg ${hasError ? "text-red-400" : "text-text-muted-light dark:text-text-muted-dark"}`}>
            {icon}
          </span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-9 py-2.5 rounded-lg bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark text-sm focus:outline-none"
        />
        {/* Right adornment: spinner / check / clear */}
        <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {loading ? (
            <span className="material-symbols-outlined text-lg text-text-muted-light dark:text-text-muted-dark animate-spin">progress_activity</span>
          ) : isValid ? (
            <span className="material-symbols-outlined text-lg text-green-500">check_circle</span>
          ) : query ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => { setQuery(""); onChange(null); setSuggestions([]); setIsOpen(false); setInternalError(null); }}
              className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          ) : null}
        </span>
      </div>

      {/* Error message */}
      {hasError && (
        <div className="flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-red-500 text-sm">error</span>
          <p className="text-xs text-red-500 dark:text-red-400">{displayError}</p>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {suggestions.map((s, idx) => {
            const parts = s.displayName.split(",");
            const primary = parts.slice(0, 2).join(",").trim();
            const secondary = parts.slice(2).join(",").trim();
            return (
              <li
                key={s.placeId}
                onMouseDown={() => pickSuggestion(s)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`px-4 py-2.5 cursor-pointer flex items-start gap-2.5 transition-colors text-sm ${
                  idx === activeIdx
                    ? "bg-primary/10 dark:bg-primary/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">location_on</span>
                <div className="min-w-0">
                  <p className="font-medium text-text-light dark:text-text-dark truncate">{primary}</p>
                  {secondary && (
                    <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">{secondary}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* No results state inside dropdown */}
      {isOpen && suggestions.length === 0 && internalError && (
        <div className="absolute z-50 mt-1 w-full bg-surface-light dark:bg-surface-dark border border-red-300 dark:border-red-700 rounded-lg shadow-lg p-4 text-center">
          <span className="material-symbols-outlined text-red-400 text-2xl mb-1">wrong_location</span>
          <p className="text-sm text-red-500 dark:text-red-400">{internalError}</p>
        </div>
      )}
    </div>
  );
}
