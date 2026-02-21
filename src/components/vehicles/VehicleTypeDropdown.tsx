/**
 * @module vehicles/VehicleTypeDropdown
 * Dropdown filter for selecting a vehicle category.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { VehicleCategory } from "../../types";
import { useDropdown } from "../../hooks/useDropdown";
import { useClickPop } from "../../hooks/useGsap";
import { dropdownEnter } from "../../lib/animations";
import { vehicleCategories } from "./constants";

interface VehicleTypeDropdownProps {
  /** Currently selected category, or null for "All Types". */
  value: VehicleCategory | null;
  /** Callback when a category is selected. */
  onChange: (v: VehicleCategory | null) => void;
}

/** Dropdown filter for vehicle category. */
export default function VehicleTypeDropdown({ value, onChange }: VehicleTypeDropdownProps) {
  const dropdown = useDropdown();
  const pop = useClickPop();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdown.isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(menuRef.current!);
    });
    return () => ctx.revert();
  }, [dropdown.isOpen]);

  return (
    <div className="relative" ref={dropdown.ref}>
      <button
        onClick={dropdown.toggle}
        {...pop}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        {value ?? "Vehicle Type"}
        <span className="material-symbols-outlined text-lg">expand_more</span>
      </button>
      {dropdown.isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-52 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-[100]"
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
            onClick={() => {
              onChange(null);
              dropdown.close();
            }}
          >
            All Types
          </button>
          {vehicleCategories.map((cat) => (
            <button
              key={cat}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === cat
                  ? "text-primary bg-primary/5"
                  : "text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => {
                onChange(cat);
                dropdown.close();
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
