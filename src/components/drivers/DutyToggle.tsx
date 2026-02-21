/**
 * @module drivers/DutyToggle
 * Toggle switch for driver duty status with label.
 */

import { dutyToggleColor, dutyStatusStyles } from "./constants";
import type { DriverDutyStatus } from "../../types";

interface DutyToggleProps {
  /** Current duty status. */
  status: DriverDutyStatus;
  /** Callback fired when the toggle is clicked. */
  onToggle: () => void;
}

/** Animated toggle switch with duty status label. */
export default function DutyToggle({ status, onToggle }: DutyToggleProps) {
  const isOn = status === "On Duty";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dutyToggleColor[status]}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className={`text-xs font-medium whitespace-nowrap ${dutyStatusStyles[status]}`}>
        {status}
      </span>
    </div>
  );
}
