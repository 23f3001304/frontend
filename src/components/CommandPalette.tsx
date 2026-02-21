/**
 * @module CommandPalette
 * Full-screen search modal triggered by Ctrl+K.
 * Filters trips across all fields (ID, vehicle, driver, route, status).
 * Animates in with GSAP `modalEnter`.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import type { Trip } from "../types";
import { modalEnter } from "../lib/animations";

/** Props accepted by the {@link CommandPalette} component. */
interface CommandPaletteProps {
  /** Whether the palette is currently visible. */
  isOpen: boolean;
  /** Callback to dismiss the palette. */
  onClose: () => void;
  /** Full trips array to search within. */
  trips: Trip[];
  /** Callback when the user selects a trip result. */
  onSelectTrip: (trip: Trip) => void;
}

/**
 * Searchable command palette overlay.
 * Backdrop and panel animate in via GSAP timeline.
 */
export default function CommandPalette({
  isOpen,
  onClose,
  trips,
  onSelectTrip,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // GSAP entrance animation
  useEffect(() => {
    if (!isOpen || !backdropRef.current || !panelRef.current) return;
    const ctx = gsap.context(() => {
      modalEnter(backdropRef.current!, panelRef.current!);
    });
    return () => ctx.revert();
  }, [isOpen]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return trips.slice(0, 8);
    const q = query.toLowerCase();
    return trips.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.vehicle.name.toLowerCase().includes(q) ||
        t.vehicle.licensePlate.toLowerCase().includes(q) ||
        (t.driver?.name.toLowerCase().includes(q) ?? false) ||
        t.route.from.toLowerCase().includes(q) ||
        t.route.to.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [query, trips]);

  // Keyboard navigation: Escape, ArrowUp, ArrowDown, Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => {
          const max = results.length - 1;
          const next = prev < max ? prev + 1 : 0;
          requestAnimationFrame(() => scrollItemIntoView(next));
          return next;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => {
          const max = results.length - 1;
          const next = prev > 0 ? prev - 1 : max;
          requestAnimationFrame(() => scrollItemIntoView(next));
          return next;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (results.length > 0) {
          onSelectTrip(results[activeIndex]);
          onClose();
        }
        break;
    }
  };

  /** Scroll the active item into view inside the list container. */
  function scrollItemIntoView(index: number) {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("li");
    items[index]?.scrollIntoView({ block: "nearest" });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div ref={panelRef} className="relative w-full max-w-lg mx-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="flex items-center px-4 border-b border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl mr-3">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 py-3.5 bg-transparent text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark text-sm focus:outline-none"
            placeholder="Search trips, vehicles, drivers, routes..."
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
              <span className="material-symbols-outlined text-3xl mb-2 block">
                search_off
              </span>
              No results found for "{query}"
            </div>
          ) : (
            <ul ref={listRef} className="py-2">
              {results.map((trip, idx) => (
                <li key={trip.id}>
                  <button
                    className={`w-full flex items-center px-4 py-2.5 text-left transition-colors ${
                      idx === activeIndex
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                  >
                    <div className="shrink-0 h-8 w-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-3">
                      <span className="material-symbols-outlined text-lg">
                        local_shipping
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          {trip.id}
                        </span>
                        <span className="text-sm text-text-light dark:text-text-dark">
                          {trip.vehicle.name}
                        </span>
                      </div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {trip.route.from} → {trip.route.to}
                        {trip.driver && ` · ${trip.driver.name}`}
                      </div>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-text-muted-light dark:text-text-muted-dark ml-2 shrink-0">
                      {trip.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
          <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded text-xs">↑↓</kbd>
              navigate
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded text-xs">↵</kbd>
              select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
