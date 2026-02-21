/**
 * @module Sidebar
 * Persistent navigation sidebar with:
 *  - Desktop: fixed left rail (hidden on mobile).
 *  - Mobile: slide-in drawer with overlay backdrop.
 *  - Bottom user profile section with popup menu.
 *
 * Nav items stagger-animate in on mount; the user menu popup
 * animates with GSAP `dropdownEnter`.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { NavItem, UserProfile } from "../types";
import { useDropdown } from "../hooks/useDropdown";
import { useClickPop } from "../hooks/useGsap";
import gsap from "gsap";
import { staggerFadeIn, dropdownEnter, fadeSlideIn } from "../lib/animations";
import { authService } from "../services";

/** Props accepted by the {@link Sidebar} component. */
interface SidebarProps {
  /** Navigation link definitions. */
  navItems: NavItem[];
  /** Currently authenticated user. */
  user: UserProfile;
  /** Whether the mobile drawer is open. */
  mobileOpen: boolean;
  /** Callback to close the mobile drawer. */
  onClose: () => void;
  /** Callback to open the Settings modal. */
  onSettingsOpen?: () => void;
}

/** Sidebar view mode. */
type SidebarMode = "nav" | "profile";

/** Sign out via AuthService. */
const handleSignOut = () => {
  authService.signOut();
};

/**
 * Sidebar layout with desktop rail and mobile drawer.
 * Nav items stagger-fade in; user popup uses GSAP dropdown animation.
 */
export default function Sidebar({
  navItems,
  user,
  mobileOpen,
  onClose,
  onSettingsOpen,
}: SidebarProps) {
  const [activeNav, setActiveNav] = useState(
    navItems.find((n) => n.active)?.label ?? navItems[0]?.label
  );
  const [mode, setMode] = useState<SidebarMode>("nav");
  const [profileActive, setProfileActive] = useState<"profile" | "settings" | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenu = useDropdown();
  const pop = useClickPop();
  const navRef = useRef<HTMLElement>(null);
  const profileNavRef = useRef<HTMLElement>(null);
  const menuPopupRef = useRef<HTMLDivElement>(null);

  // Sync active nav with current route
  useEffect(() => {
    const match = navItems.find((item) => item.href !== "#" && location.pathname.startsWith(item.href));
    if (match) setActiveNav(match.label);
  }, [location.pathname, navItems]);

  // Stagger nav items on mount
  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(navRef.current!, ":scope > a", { x: -12, y: 0, duration: 0.35, delay: 0.15 });
    });
    return () => ctx.revert();
  }, []);

  // Animate user menu popup
  useEffect(() => {
    if (!userMenu.isOpen || !menuPopupRef.current) return;
    const ctx = gsap.context(() => {
      dropdownEnter(menuPopupRef.current!);
    });
    return () => ctx.revert();
  }, [userMenu.isOpen]);

  // Animate profile nav items when entering profile mode
  useEffect(() => {
    if (mode !== "profile" || !profileNavRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(profileNavRef.current!, ":scope > button", { x: -12, y: 0, duration: 0.3, delay: 0.1 });
    });
    return () => ctx.revert();
  }, [mode]);

  /** Switch sidebar to profile mode, optionally highlighting an item. */
  const enterProfileMode = (active: "profile" | "settings") => {
    setProfileActive(active);
    setMode("profile");
    userMenu.close();
  };

  /** Return to normal navigation mode. */
  const exitProfileMode = () => {
    setProfileActive(null);
    setMode("nav");
  };

  const sidebarContent = (
    <>
      <div>
        {/* Logo + close button for mobile */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center">
            <span className="material-symbols-outlined text-primary text-3xl mr-2">
              local_shipping
            </span>
            <h1 className="text-xl font-bold tracking-tight">Fleet Flow</h1>
          </div>
          <button
            className="md:hidden text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation — normal mode */}
        {mode === "nav" && (
          <nav ref={navRef} className="mt-6 px-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.label);
                  if (item.href !== "#") navigate(item.href);
                  onClose(); // close on mobile after click
                }}
                {...pop}
                className={
                  activeNav === item.label
                    ? "group flex items-center px-3 py-2.5 text-sm font-medium bg-primary/10 text-primary rounded-md"
                    : "group flex items-center px-3 py-2.5 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-light dark:hover:text-text-dark rounded-md transition-colors"
                }
              >
                <span className="material-symbols-outlined mr-3 text-xl">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Navigation — profile / account mode */}
        {mode === "profile" && (
          <div className="mt-6 px-3">
            {/* Back button */}
            <button
              onClick={exitProfileMode}
              {...pop}
              className="flex items-center gap-2 px-3 py-2 mb-4 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors w-full"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Navigation
            </button>

            <div className="border-t border-border-light dark:border-border-dark mb-4" />

            {/* Profile header */}
            <div className="flex items-center gap-3 px-3 mb-5">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-light dark:text-text-dark truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                  {user.email}
                </p>
                <p className="text-xs text-primary font-medium">{user.role}</p>
              </div>
            </div>

            {/* Profile nav items */}
            <nav ref={profileNavRef} className="space-y-1">
              <button
                onClick={() => {
                  setProfileActive("profile");
                  navigate("/profile");
                  onClose();
                }}
                {...pop}
                className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  profileActive === "profile"
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-light dark:hover:text-text-dark"
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-xl">person</span>
                My Profile
              </button>
              <button
                onClick={() => {
                  setProfileActive("settings");
                  navigate("/account-settings");
                  onClose();
                }}
                {...pop}
                className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  profileActive === "settings"
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-light dark:hover:text-text-dark"
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-xl">settings</span>
                Account Settings
              </button>
              <div className="border-t border-border-light dark:border-border-dark my-2" />
              <button
                onClick={handleSignOut}
                {...pop}
                className="w-full group flex items-center px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <span className="material-symbols-outlined mr-3 text-xl">logout</span>
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* User Profile footer */}
      {mode === "nav" && (
        <div className="p-4 border-t border-border-light dark:border-border-dark relative" ref={userMenu.ref}>
          <button
            className="flex items-center w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 -m-1 transition-colors"
            onClick={userMenu.toggle}
          >
            <img
              src={user.avatarUrl}
              alt="User avatar"
              className="h-9 w-9 rounded-full object-cover border border-border-light dark:border-gray-600"
            />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-text-light dark:text-text-dark truncate">
                {user.name}
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark truncate">
                {user.role}
              </p>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark text-lg ml-1">
              {userMenu.isOpen ? "expand_more" : "expand_less"}
            </span>
          </button>

          {/* Quick popup — switches sidebar to profile mode */}
          {userMenu.isOpen && (
            <div ref={menuPopupRef} className="absolute bottom-full left-4 right-4 mb-2 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50">
              <button
                className="w-full flex items-center px-4 py-2.5 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  enterProfileMode("profile");
                  navigate("/profile");
                  onClose();
                }}
              >
                <span className="material-symbols-outlined text-lg mr-3 text-text-muted-light dark:text-text-muted-dark">
                  person
                </span>
                View Profile
              </button>
              <button
                className="w-full flex items-center px-4 py-2.5 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  enterProfileMode("settings");
                  navigate("/account-settings");
                  onClose();
                }}
              >
                <span className="material-symbols-outlined text-lg mr-3 text-text-muted-light dark:text-text-muted-dark">
                  settings
                </span>
                Account Settings
              </button>
              <div className="border-t border-border-light dark:border-border-dark my-1" />
              <button
                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={() => {
                  handleSignOut();
                  userMenu.close();
                }}
              >
                <span className="material-symbols-outlined text-lg mr-3">
                  logout
                </span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-col justify-between hidden md:flex shrink-0 transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col justify-between md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
