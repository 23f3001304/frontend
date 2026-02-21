/**
 * @module components/RoleSwitcher
 * A dropdown selector for switching the active user role at runtime.
 * Intended for development / demo purposes — in production the role
 * would come from the authentication backend.
 *
 * Shows a coloured badge for the current role and a dropdown with
 * all available roles.
 */

import { useAuth } from "../contexts/RBACContext";
import { USER_ROLE_LABELS, type UserRole } from "../types";

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  fleet_manager: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  dispatcher: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  safety_officer: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  financial_analyst: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  fleet_manager: "Oversee vehicle health, asset lifecycle, and scheduling",
  dispatcher: "Create trips, assign drivers, and validate cargo loads",
  safety_officer: "Monitor driver compliance, license expirations, and safety scores",
  financial_analyst: "Audit fuel spend, maintenance ROI, and operational costs",
};

const ALL_ROLES: UserRole[] = [
  "fleet_manager",
  "dispatcher",
  "safety_officer",
  "financial_analyst",
];

export default function RoleSwitcher() {
  const { role, switchRole } = useAuth();

  return (
    <div>
      <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
        Active Role
      </label>
      <div className="space-y-2">
        {ALL_ROLES.map((r) => (
          <button
            key={r}
            onClick={() => switchRole(r)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              role === r
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                {USER_ROLE_LABELS[r]}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLE_BADGE_CLASSES[r]}`}
              >
                {role === r ? "Active" : "Switch"}
              </span>
            </div>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
              {ROLE_DESCRIPTIONS[r]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
