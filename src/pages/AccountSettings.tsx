/**
 * @module AccountSettings
 * Account Settings page — manage personal info, security, preferences,
 * and notification settings in a full-page layout.
 *
 * Features:
 *  - Breadcrumb navigation (Fleet › Account Settings).
 *  - Personal Information form (name, email, phone, department).
 *  - Security section (password change, two-factor authentication).
 *  - Notification preferences toggles.
 *  - Danger zone (deactivate account).
 *  - GSAP entrance animations.
 */

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useClickPop } from "../hooks/useGsap";
import { fadeSlideIn, staggerFadeIn } from "../lib/animations";
import { currentUser } from "../data";
import { useAuth } from "../contexts/RBACContext";
import { USER_ROLE_LABELS } from "../types";

export default function AccountSettings() {
  const pop = useClickPop();
  const { role } = useAuth();
  const titleRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  /* ─── Form state (would connect to API in prod) ─── */
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("+1 (555) 234-5678");
  const [department, setDepartment] = useState("Operations");
  const [twoFactor, setTwoFactor] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) fadeSlideIn(titleRef.current, "left", { duration: 0.25, x: -12 });
      if (sectionsRef.current) staggerFadeIn(sectionsRef.current, ":scope > section", { y: 16, duration: 0.3, delay: 0.1 });
    });
    return () => ctx.revert();
  }, []);

  const handleSave = () => {
    console.log("[AccountSettings] Save:", { name, email, phone, department });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 flex items-center gap-1">
        <span className="hover:text-primary cursor-pointer transition-colors">Fleet</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-light dark:text-text-dark font-medium">Account Settings</span>
      </nav>

      {/* Title */}
      <div ref={titleRef} className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-light dark:text-text-dark">
          Account Settings
        </h2>
        <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">
          Manage your account preferences, security, and notifications.
        </p>
      </div>

      <div ref={sectionsRef} className="space-y-6 max-w-3xl">
        {/* ─── Personal Information ─── */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">person</span>
            Personal Information
          </h3>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-5">
            Update your name, email, and contact details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" value={name} onChange={setName} />
            <FormField label="Email Address" value={email} onChange={setEmail} type="email" />
            <FormField label="Phone Number" value={phone} onChange={setPhone} type="tel" />
            <FormField label="Department" value={department} onChange={setDepartment} />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark">Role:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                {USER_ROLE_LABELS[role]}
              </span>
            </div>
            <button
              onClick={handleSave}
              {...pop}
              className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* ─── Security ─── */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">shield</span>
            Security
          </h3>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-5">
            Manage your password and two-factor authentication.
          </p>

          <div className="space-y-4">
            {/* Password */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">Password</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Last changed 42 days ago
                </p>
              </div>
              <button
                {...pop}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Change Password
              </button>
            </div>

            <div className="border-t border-border-light dark:border-border-dark" />

            {/* 2FA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Add an extra layer of security to your account
                </p>
              </div>
              <ToggleSwitch checked={twoFactor} onChange={setTwoFactor} />
            </div>

            <div className="border-t border-border-light dark:border-border-dark" />

            {/* Active sessions */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">Active Sessions</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  1 active session on this device
                </p>
              </div>
              <button
                {...pop}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Manage Sessions
              </button>
            </div>
          </div>
        </section>

        {/* ─── Notifications ─── */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
          <h3 className="text-base font-semibold text-text-light dark:text-text-dark mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">notifications</span>
            Notification Preferences
          </h3>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-5">
            Choose how you want to be notified about fleet activity.
          </p>

          <div className="space-y-4">
            <NotifRow
              icon="email"
              label="Email Notifications"
              description="Receive trip updates, alerts, and reports via email"
              checked={emailNotifs}
              onChange={setEmailNotifs}
            />
            <div className="border-t border-border-light dark:border-border-dark" />
            <NotifRow
              icon="phone_android"
              label="Push Notifications"
              description="Get real-time alerts on your mobile device"
              checked={pushNotifs}
              onChange={setPushNotifs}
            />
            <div className="border-t border-border-light dark:border-border-dark" />
            <NotifRow
              icon="summarize"
              label="Weekly Digest"
              description="Receive a weekly summary of fleet performance"
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        </section>

        {/* ─── Danger zone ─── */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-red-200 dark:border-red-900/40 p-6">
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">warning</span>
            Danger Zone
          </h3>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
            Irreversible actions that affect your account.
          </p>
          <button
            {...pop}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Deactivate Account
          </button>
        </section>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-lg border border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
      />
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function NotifRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-xl text-text-muted-light dark:text-text-muted-dark mt-0.5">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-text-light dark:text-text-dark">{label}</p>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}
