/**
 * @module services/AuthService
 * OOP service layer for authentication & user-account operations.
 *
 * All methods are currently stubs that simulate async API calls.
 * Replace with real HTTP calls when the backend is ready.
 */

/* ─── Service ─── */

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /** [TODO] Navigate to profile page or open profile modal. */
  async viewProfile(): Promise<void> {
    console.log("[AuthService] viewProfile");
    // TODO: navigate to /profile or open modal
  }

  /** [TODO] Navigate to account settings. */
  async accountSettings(): Promise<void> {
    console.log("[AuthService] accountSettings");
    // TODO: navigate to /settings/account
  }

  /** [TODO] Sign the user out. */
  async signOut(): Promise<void> {
    console.log("[AuthService] signOut");
    // TODO: clear tokens, redirect to /login
  }
}

export const authService = AuthService.getInstance();
export default AuthService;
