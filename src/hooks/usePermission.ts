/**
 * @module hooks/usePermission
 * Ergonomic permission-checking hook that wraps {@link useAuth}.
 *
 * @example
 * ```tsx
 * const { can, canAny, canAll, role } = usePermission();
 * if (can("vehicles:create")) showCreateButton();
 * ```
 */

import { useAuth } from "../contexts/RBACContext";

/**
 * Convenience hook — re-exports the RBAC helpers from context
 * so consumers don't need to import the context directly.
 */
export function usePermission() {
  const { can, canAll, canAny, role, user } = useAuth();
  return { can, canAll, canAny, role, user } as const;
}
