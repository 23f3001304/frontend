/**
 * @module AppLayout
 * Shared application shell rendered around every route.
 *
 * Provides:
 *  - **RBACProvider** — exposes the current user role & permission helpers.
 *  - Sidebar (desktop + mobile drawer) — nav items filtered by role.
 *  - Header with search, filters, theme toggle, and settings.
 *  - Ctrl+K command palette overlay.
 *  - Settings modal (theme, page size, role switcher).
 *  - A scrollable `<Outlet />` area where page content renders.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CommandPalette from "../components/CommandPalette";
import SettingsModal from "../components/SettingsModal";
import { NewTripModal } from "../components/dispatcher";
import { NewVehicleModal } from "../components/vehicles";
import { RBACProvider } from "../contexts/RBACContext";
import { useTheme } from "../hooks/useTheme";
import { navItems, currentUser, trips } from "../data";
import { filterNavItems } from "../lib/rbac";
import { USER_ROLE_LABELS, type UserRole } from "../types";

/** Default number of trip rows shown per table page. */
const DEFAULT_PAGE_SIZE = 5;

/**
 * Persistent application shell with sidebar, header, and overlays.
 * Child routes render inside the scrollable content area via `<Outlet />`.
 */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showNewTrip, setShowNewTrip] = useState(false);
  const [showNewVehicle, setShowNewVehicle] = useState(false);

  // ─── RBAC: active role (switchable at runtime for demo) ───
  const [activeRole, setActiveRole] = useState<UserRole>(currentUser.userRole);

  /** User object with the currently-active role applied. */
  const activeUser = useMemo(
    () => ({
      ...currentUser,
      userRole: activeRole,
      role: USER_ROLE_LABELS[activeRole],
    }),
    [activeRole],
  );

  /** Nav items filtered to what the active role may see. */
  const visibleNavItems = useMemo(
    () => filterNavItems(navItems, activeRole),
    [activeRole],
  );

  const { theme, setTheme, resolvedTheme } = useTheme();

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectTrip = (trip: (typeof trips)[number]) => {
    console.log("Selected trip from command palette:", trip.id);
    setCommandPaletteOpen(false);
  };

  const handleThemeToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
  }, []);

  return (
    <RBACProvider user={activeUser} onRoleChange={setActiveRole}>
    <div className="bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark h-screen flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600/75 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        navItems={visibleNavItems}
        user={activeUser}
        mobileOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark min-w-0">
        <Header
          onMenuClick={openSidebar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          onSettingsOpen={() => setSettingsOpen(true)}
          resolvedTheme={resolvedTheme}
          onThemeToggle={handleThemeToggle}
          onNewTrip={() => setShowNewTrip(true)}
          onNewVehicle={() => setShowNewVehicle(true)}
        />

        {/* Scrollable page content — child routes render here */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <Outlet context={{
            searchQuery,
            pageSize,
            onPageSizeChange: handlePageSizeChange,
            notifications,
            onNotificationsChange: setNotifications,
            autoRefresh,
            onAutoRefreshChange: setAutoRefresh,
            onNewTrip: () => setShowNewTrip(true),
          }} />
        </div>
      </main>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        trips={trips}
        onSelectTrip={handleSelectTrip}
      />

      {/* New Trip Modal */}
      <NewTripModal
        open={showNewTrip}
        onClose={() => setShowNewTrip(false)}
      />

      {/* New Vehicle Modal */}
      <NewVehicleModal
        open={showNewVehicle}
        onClose={() => setShowNewVehicle(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        notifications={notifications}
        onNotificationsChange={setNotifications}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
      />
    </div>
    </RBACProvider>
  );
}
