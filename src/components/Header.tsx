/**
 * @module Header
 * Top-bar of the dashboard containing:
 *  - Mobile hamburger toggle.
 *  - Search input (opens Command Palette on click / Ctrl+K).
 *  - Filter / Group / Sort dropdown buttons.
 *  - Theme toggle (light ↔ dark).
 *  - Settings gear button.
 *  - New Trip / New Vehicle action buttons.
 *
 * Buttons use GSAP click-pop feedback; dropdowns animate with
 * `dropdownEnter`.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDropdown } from "../hooks/useDropdown";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn, dropdownEnter } from "../lib/animations";

/** Props accepted by the {@link Header} component. */
interface HeaderProps {
  /** Opens the mobile sidebar drawer. */
  onMenuClick: () => void;
  /** Current header search query text. */
  searchQuery: string;
  /** Callback when the search text changes. */
  onSearchChange: (query: string) => void;
  /** Callback to open the Ctrl+K command palette. */
  onCommandPaletteOpen: () => void;
  /** Callback to open the settings modal. */
  onSettingsOpen: () => void;
  /** The resolved theme (`"light"` or `"dark"` after system detection). */
  resolvedTheme: "light" | "dark";
  /** Toggles between light and dark themes. */
  onThemeToggle: () => void;
  /** Opens the New Trip modal. */
  onNewTrip: () => void;
  /** Opens the New Vehicle modal. */
  onNewVehicle: () => void;
}

/**
 * Dashboard top-bar. Fade-slides in on mount.
 * All action buttons have click-pop micro-animation feedback.
 */
export default function Header({
  onMenuClick,
  searchQuery,
  onSearchChange,
  onCommandPaletteOpen,
  onSettingsOpen,
  resolvedTheme,
  onThemeToggle,
  onNewTrip,
  onNewVehicle,
}: HeaderProps) {
  const pop = useClickPop();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(headerRef.current!, "down", { duration: 0.35, y: -16 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="h-auto sm:h-16 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-0 shrink-0 z-10 shadow-sm gap-3 sm:gap-0">
      {/* Left section: hamburger + search + filters */}
      <div className="flex items-center flex-1 min-w-0 gap-2">
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-1 rounded-md text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
          onClick={onMenuClick}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div
          className="relative flex-1 max-w-md cursor-text"
          onClick={onCommandPaletteOpen}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-xl">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            className="block w-full pl-10 pr-16 py-2 border border-border-light dark:border-border-dark rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-text-light dark:text-text-dark placeholder-text-muted-light dark:placeholder-text-muted-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition duration-150 ease-in-out"
            placeholder="Search trips, vehicles, drivers..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-text-muted-light dark:text-text-muted-dark bg-gray-100 dark:bg-gray-700 border border-border-light dark:border-border-dark rounded">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Filter buttons - hidden on small screens */}
        <div className="hidden lg:flex items-center space-x-2 ml-2">
          <FilterDropdown
            icon="group_work"
            label="Group"
            options={["By Vehicle Type", "By Driver", "By Status", "By Route"]}
          />
          <FilterDropdown
            icon="filter_list"
            label="Filter"
            options={["Active Trips", "Maintenance Only", "Ready Vehicles", "Unassigned"]}
          />
          <FilterDropdown
            icon="sort"
            label="Sort"
            options={["Trip ID (Asc)", "Trip ID (Desc)", "ETA (Nearest)", "ETA (Farthest)"]}
          />
        </div>
      </div>

      {/* Right section: theme + settings + action buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3 sm:ml-4">
        {/* Mobile-only filter button */}
        <div className="lg:hidden">
          <FilterDropdown
            icon="tune"
            label=""
            options={["Group by Type", "Filter Active", "Sort by ETA"]}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          {...pop}
          className="flex items-center justify-center p-2 rounded-md text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="material-symbols-outlined text-xl">
            {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsOpen}
          {...pop}
          className="flex items-center justify-center p-2 rounded-md text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        <button
          className="flex items-center px-3 sm:px-4 py-2 border border-primary text-primary bg-surface-light dark:bg-transparent dark:text-primary rounded-md shadow-sm text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={onNewTrip}
          {...pop}
        >
          <span className="material-symbols-outlined text-lg mr-1">add</span>
          <span className="hidden sm:inline">New Trip</span>
          <span className="sm:hidden">Trip</span>
        </button>
        <button
          className="flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          onClick={onNewVehicle}
          {...pop}
        >
          <span className="material-symbols-outlined text-lg mr-1">
            local_shipping
          </span>
          <span className="hidden sm:inline">New Vehicle</span>
          <span className="sm:hidden">Vehicle</span>
        </button>
      </div>
    </header>
  );
}

/**
 * Reusable filter dropdown button with animated menu.
 * Dropdown container animates in via GSAP on open.
 *
 * @param icon    - Material Symbols icon name.
 * @param label   - Button label (empty on mobile compact mode).
 * @param options - List of option strings to display.
 */
function FilterDropdown({
  icon,
  label,
  options,
}: {
  icon: string;
  label: string;
  options: string[];
}) {
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

  const handleOptionClick = (option: string) => {
    console.log(`${label || "Filter"} selected:`, option);
    dropdown.close();
  };

  return (
    <div className="relative" ref={dropdown.ref}>
      <button
        type="button"
        onClick={dropdown.toggle}
        {...pop}
        className="inline-flex items-center justify-center rounded-md border border-border-light dark:border-border-dark shadow-sm px-3 py-2 bg-surface-light dark:bg-surface-dark text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary transition-colors"
      >
        <span className="material-symbols-outlined text-lg">{icon}</span>
        {label && <span className="ml-1">{label}</span>}
      </button>

      {dropdown.isOpen && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50">
          {options.map((option) => (
            <button
              key={option}
              className="w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
