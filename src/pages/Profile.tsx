/**
 * @module Profile
 * User profile page — displays personal info, role, activity stats,
 * and quick-action cards.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › My Profile).
 *  - Profile hero card with avatar, name, email, role badge.
 *  - Info grid: Contact, Role & Permissions, Activity stats.
 *  - Quick actions: Edit Profile, Change Password, Notification Prefs.
 *  - GSAP entrance animations.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn, staggerFadeIn } from "../lib/animations";
import { currentUser } from "../data";
import { useAuth } from "../contexts/RBACContext";
import { USER_ROLE_LABELS } from "../types";

/* ─── Static profile info (would come from API in prod) ─── */

const profileDetails = {
  phone: "+1 (555) 234-5678",
  department: "Operations",
  location: "San Francisco, CA",
  joinDate: "March 2021",
  lastLogin: "Today, 10:32 AM",
  totalTripsManaged: 1_248,
  vehiclesOverseen: 64,
  avgResponseTime: "12 min",
};

export default function Profile() {
  const pop = useClickPop();
  const { role } = useAuth();
  const titleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (heroRef.current) fadeSlideIn(heroRef.current, "up", { duration: 0.3, delay: 0.08 });
      if (gridRef.current) staggerFadeIn(gridRef.current, ":scope > div", { y: 16, duration: 0.3, delay: 0.15 });
      if (actionsRef.current) staggerFadeIn(actionsRef.current, ":scope > button", { y: 12, duration: 0.25, delay: 0.25 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">My Profile</span>
      </nav>

      {/* Title */}
      <div ref={titleRef} className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
          My Profile
        </h2>
        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
          View and manage your personal information.
        </p>
      </div>

      {/* Hero card */}
      <div
        ref={heroRef}
        className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 sm:p-8 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-primary shadow-lg"
          />
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
              {currentUser.name}
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
              {currentUser.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {USER_ROLE_LABELS[role]}
              </span>
              <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                Active
              </span>
            </div>
          </div>
          <button
            {...pop}
            className="flex items-center gap-2 px-4 py-2 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Contact info */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">contact_phone</span>
            Contact Information
          </h4>
          <dl className="space-y-3">
            <InfoRow label="Email" value={currentUser.email} />
            <InfoRow label="Phone" value={profileDetails.phone} />
            <InfoRow label="Location" value={profileDetails.location} />
            <InfoRow label="Department" value={profileDetails.department} />
          </dl>
        </div>

        {/* Role & access */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">shield</span>
            Role &amp; Access
          </h4>
          <dl className="space-y-3">
            <InfoRow label="Role" value={USER_ROLE_LABELS[role]} />
            <InfoRow label="Joined" value={profileDetails.joinDate} />
            <InfoRow label="Last Login" value={profileDetails.lastLogin} />
            <InfoRow label="Status" value="Active" valueColor="text-green-600 dark:text-green-400" />
          </dl>
        </div>

        {/* Activity stats */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">insights</span>
            Activity Overview
          </h4>
          <dl className="space-y-3">
            <InfoRow label="Trips Managed" value={profileDetails.totalTripsManaged.toLocaleString()} />
            <InfoRow label="Vehicles Overseen" value={String(profileDetails.vehiclesOverseen)} />
            <InfoRow label="Avg. Response" value={profileDetails.avgResponseTime} />
            <InfoRow label="Completion Rate" value="98.2%" valueColor="text-green-600 dark:text-green-400" />
          </dl>
        </div>
      </div>

      {/* Quick actions */}
      <div ref={actionsRef} className="flex flex-wrap gap-3">
        <QuickAction icon="lock_reset" label="Change Password" onClick={() => console.log("[Profile] Change password")} />
        <QuickAction icon="notifications_active" label="Notification Preferences" onClick={() => console.log("[Profile] Notification prefs")} />
        <QuickAction icon="download" label="Download My Data" onClick={() => console.log("[Profile] Download data")} />
        <QuickAction icon="support_agent" label="Contact Support" onClick={() => console.log("[Profile] Contact support")} />
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-text-muted-light dark:text-text-muted-dark">{label}</dt>
      <dd className={`text-sm font-medium ${valueColor ?? "text-text-light dark:text-text-dark"}`}>{value}</dd>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const pop = useClickPop();
  return (
    <button
      onClick={onClick}
      {...pop}
      className="flex items-center gap-2 px-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <span className="material-symbols-outlined text-lg text-primary">{icon}</span>
      {label}
    </button>
  );
}
