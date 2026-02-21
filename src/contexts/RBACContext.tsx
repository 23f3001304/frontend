/**
 * @module contexts/RBACContext
 * React context that exposes the current user's profile and RBAC helpers
 * to every component in the tree.
 *
 * Usage:
 * ```tsx
 * // In a parent (e.g. App or AppLayout):
 * <RBACProvider user={currentUser}>
 *   <App />
 * </RBACProvider>
 *
 * // In any child:
 * const { user, can, canAll, canAny } = useAuth();
 * if (can("vehicles:create")) { ... }
 * ```
 */

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { UserProfile, Permission, UserRole } from "../types";
import { hasPermission, hasAllPermissions, hasAnyPermission } from "../lib/rbac";

/* ─── Context Shape ─── */

interface RBACContextValue {
  /** The currently authenticated user. */
  user: UserProfile;
  /** Shortcut to the user's RBAC role key. */
  role: UserRole;
  /** Check a single permission. */
  can: (permission: Permission) => boolean;
  /** Check that **all** listed permissions are granted. */
  canAll: (permissions: Permission[]) => boolean;
  /** Check that **at least one** listed permission is granted. */
  canAny: (permissions: Permission[]) => boolean;
  /** Switch to a different role (demo only — in production this would re-authenticate). */
  switchRole: (role: UserRole) => void;
}

const RBACContext = createContext<RBACContextValue | null>(null);

/* ─── Provider ─── */

interface RBACProviderProps {
  user: UserProfile;
  onRoleChange?: (role: UserRole) => void;
  children: ReactNode;
}

export function RBACProvider({ user, onRoleChange, children }: RBACProviderProps) {
  const role = user.userRole;

  const can = useCallback(
    (permission: Permission) => hasPermission(role, permission),
    [role],
  );
  const canAll = useCallback(
    (permissions: Permission[]) => hasAllPermissions(role, permissions),
    [role],
  );
  const canAny = useCallback(
    (permissions: Permission[]) => hasAnyPermission(role, permissions),
    [role],
  );
  const switchRole = useCallback(
    (newRole: UserRole) => onRoleChange?.(newRole),
    [onRoleChange],
  );

  const value = useMemo<RBACContextValue>(
    () => ({ user, role, can, canAll, canAny, switchRole }),
    [user, role, can, canAll, canAny, switchRole],
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

/* ─── Hook ─── */

/**
 * Access the current RBAC context.
 * Must be called inside a `<RBACProvider>`.
 *
 * @throws {Error} if used outside the provider tree.
 */
export function useAuth(): RBACContextValue {
  const ctx = useContext(RBACContext);
  if (!ctx) {
    throw new Error("useAuth() must be used within <RBACProvider>");
  }
  return ctx;
}
