/**
 * @module pages/AccessDenied
 * Full-page "403 — Access Denied" screen shown when a user
 * navigates to a route they don't have permission for.
 */

import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { fadeSlideIn } from "../lib/animations";
import { useClickPop } from "../hooks/useGsap";
import { useAuth } from "../contexts/RBACContext";
import { USER_ROLE_LABELS } from "../types";

export default function AccessDenied() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const pop = useClickPop();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      fadeSlideIn(ref.current!, "up", { duration: 0.35 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <span className="material-symbols-outlined text-6xl text-red-400 mb-4">
        lock
      </span>
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
        Access Denied
      </h2>
      <p className="text-text-muted-light dark:text-text-muted-dark mb-1 max-w-md">
        Your current role{" "}
        <span className="font-semibold text-text-light dark:text-text-dark">
          ({USER_ROLE_LABELS[role]})
        </span>{" "}
        does not have permission to view this page.
      </p>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
        Contact your administrator to request access.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        {...pop}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg shadow-sm text-sm font-medium hover:bg-primary-hover transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Dashboard
      </button>
    </div>
  );
}
