/**
 * @module components/PermissionGate
 * Declarative wrapper that conditionally renders children based
 * on the current user's permissions.
 *
 * @example
 * ```tsx
 * <Can permission="vehicles:create">
 *   <button>Add Vehicle</button>
 * </Can>
 *
 * <Can anyOf={["expenses:edit", "expenses:approve"]}>
 *   <button>Manage Expense</button>
 * </Can>
 *
 * <Can permission="analytics:export" fallback={<span>No access</span>}>
 *   <ExportButton />
 * </Can>
 * ```
 */

import type { ReactNode } from "react";
import type { Permission } from "../types";
import { useAuth } from "../contexts/RBACContext";

/* ─── Props ─── */

interface CanProps {
  /** Single permission to check (logical AND with `allOf` if both supplied). */
  permission?: Permission;
  /** Require **all** of these permissions. */
  allOf?: Permission[];
  /** Require **at least one** of these permissions. */
  anyOf?: Permission[];
  /** Content shown when the user **does** have access. */
  children: ReactNode;
  /** Optional fallback rendered when access is denied (default: nothing). */
  fallback?: ReactNode;
}

/**
 * Renders `children` only if the current user satisfies the
 * specified permission check(s). Otherwise renders `fallback`.
 */
export function Can({ permission, allOf, anyOf, children, fallback = null }: CanProps) {
  const { can, canAll, canAny } = useAuth();

  let allowed = true;

  if (permission) {
    allowed = allowed && can(permission);
  }
  if (allOf && allOf.length > 0) {
    allowed = allowed && canAll(allOf);
  }
  if (anyOf && anyOf.length > 0) {
    allowed = allowed && canAny(anyOf);
  }

  return <>{allowed ? children : fallback}</>;
}

/**
 * Inverse of `<Can>` — renders children only when the user
 * does **not** have the specified permission.
 */
export function Cannot({ permission, allOf, anyOf, children, fallback = null }: CanProps) {
  const { can, canAll, canAny } = useAuth();

  let denied = true;

  if (permission) {
    denied = denied && !can(permission);
  }
  if (allOf && allOf.length > 0) {
    denied = denied && !canAll(allOf);
  }
  if (anyOf && anyOf.length > 0) {
    denied = denied && !canAny(anyOf);
  }

  return <>{denied ? children : fallback}</>;
}
