/**
 * @module SettingsModal
 * Preferences modal containing:
 *  - Appearance picker (Light / Dark / System).
 *  - Push Notifications toggle.
 *  - Auto-Refresh toggle.
 *  - Items-per-page selector.
 *
 * Animates in with GSAP `modalEnter`.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Theme } from "../hooks/useTheme";
import { useClickPop } from "../hooks/useGsap";
import { modalEnter } from "../lib/animations";
import RoleSwitcher from "./RoleSwitcher";

/** Props accepted by the {@link SettingsModal} component. */
interface SettingsModalProps {
  /** Whether the modal is currently visible. */
  isOpen: boolean;
  /** Callback to dismiss the modal. */
  onClose: () => void;
  /** Current theme preference. */
  theme: Theme;
  /** Callback when the user picks a new theme. */
  onThemeChange: (theme: Theme) => void;
  /** Current table page size. */
  pageSize: number;
  /** Callback when the user changes the page size. */
  onPageSizeChange: (size: number) => void;
  /** Whether push notifications are enabled. */
  notifications: boolean;
  /** TODO: Connect to backend — toggle push notifications. */
  onNotificationsChange: (enabled: boolean) => void;
  /** Whether auto-refresh is enabled. */
  autoRefresh: boolean;
  /** TODO: Connect to backend — toggle auto-refresh. */
  onAutoRefreshChange: (enabled: boolean) => void;
}

/** Theme picker grid options. */
const themeOptions: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "light_mode" },
  { value: "dark", label: "Dark", icon: "dark_mode" },
  { value: "system", label: "System", icon: "desktop_windows" },
];



/**
 * Settings preferences modal. Animates in with GSAP.
 * Theme buttons and the Done button have click-pop feedback.
 */
export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  pageSize,
  onPageSizeChange,
  notifications,
  onNotificationsChange,
  autoRefresh,
  onAutoRefreshChange,
}: SettingsModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pop = useClickPop();

  // GSAP entrance animation
  useEffect(() => {
    if (!isOpen || !backdropRef.current || !panelRef.current) return;
    const ctx = gsap.context(() => {
      modalEnter(backdropRef.current!, panelRef.current!);
    });
    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div ref={panelRef} className="relative w-full max-w-md mx-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-text-light dark:text-text-dark block mb-3">
              Appearance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onThemeChange(opt.value)}
                  {...pop}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                    theme === opt.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {opt.icon}
                  </span>
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <ToggleSetting
            icon="notifications"
            label="Push Notifications"
            description="Get notified about trip updates and alerts"
            checked={notifications}
            onChange={onNotificationsChange}
          />

          {/* Auto-refresh */}
          <ToggleSetting
            icon="refresh"
            label="Auto-Refresh Data"
            description="Automatically refresh dashboard every 30 seconds"
            checked={autoRefresh}
            onChange={onAutoRefreshChange}
          />

          {/* Items per page */}
          <div>
            <label className="text-sm font-medium text-text-light dark:text-text-dark block mb-1">
              Items Per Page
            </label>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-2">
              Number of rows shown in all tables
            </p>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="block w-full rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} rows
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher (Demo) */}
          <div className="pt-2 border-t border-border-light dark:border-border-dark">
            <RoleSwitcher />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex justify-end">
          <button
            onClick={onClose}
            {...pop}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable toggle switch row with icon, label, and description.
 *
 * @param icon           - Material Symbols icon name.
 * @param label          - Primary label text.
 * @param description    - Secondary description text.
 * @param checked        - Current toggle state (controlled).
 * @param onChange        - Callback when toggled.
 */
function ToggleSetting({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-xl text-text-muted-light dark:text-text-muted-dark mt-0.5">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-text-light dark:text-text-dark">
            {label}
          </p>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            {description}
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full shrink-0 mt-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
