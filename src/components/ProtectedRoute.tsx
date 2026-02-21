/**
 * @module components/ProtectedRoute
 * Route-level permission guard.
 *
 * Wraps a page route and renders {@link AccessDenied} if the
 * current user lacks the required permission.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/vehicles"
 *   element={
 *     <ProtectedRoute permission="vehicles:view">
 *       <VehicleRegistryPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */

import type { ReactNode } from "react";
import type { Permission } from "../types";
import { useAuth } from "../contexts/RBACContext";
import AccessDenied from "../pages/AccessDenied";

interface ProtectedRouteProps {
  /** Permission(s) required to access this route. */
  permission?: Permission;
  /** Require **all** of these permissions. */
  allOf?: Permission[];
  /** Require **at least one** of these permissions. */
  anyOf?: Permission[];
  children: ReactNode;
}

export default function ProtectedRoute({
  permission,
  allOf,
  anyOf,
  children,
}: ProtectedRouteProps) {
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

  if (!allowed) return <AccessDenied />;

  return <>{children}</>;
}
