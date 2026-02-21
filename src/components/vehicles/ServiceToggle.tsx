/**
 * @module vehicles/ServiceToggle
 * Animated toggle switch for vehicle service mode.
 */

interface ServiceToggleProps {
  /** Whether the service mode is currently enabled. */
  enabled: boolean;
  /** Callback fired when the toggle is clicked. */
  onToggle: () => void;
}

/** Animated toggle switch for service mode. */
export default function ServiceToggle({ enabled, onToggle }: ServiceToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
