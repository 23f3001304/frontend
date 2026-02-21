/**
 * @module App
 * Root component that defines the application's route tree.
 *
 * Uses React Router with a shared {@link AppLayout} shell
 * and individual page routes rendered via `<Outlet />`.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import VehicleRegistry from "./pages/VehicleRegistry";
import Trips from "./pages/Trips";
import TripDispatcher from "./pages/TripDispatcher";
import Maintenance from "./pages/Maintenance";
import Performance from "./pages/Performance";
import TripExpense from "./pages/TripExpense";
import Analytics from "./pages/Analytics";

/** Context shape passed from {@link AppLayout} to child routes. */
interface LayoutContext {
  searchQuery: string;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (enabled: boolean) => void;
  onNewTrip: () => void;
}

/**
 * Application root — sets up the router and maps URL paths to pages.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehicleRegistryPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/dispatcher" element={<TripDispatcherPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/expenses" element={<TripExpensePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it as props to {@link Dashboard}.
 */
function DashboardPage() {
  const { searchQuery, pageSize } = useOutletContext<LayoutContext>();
  return (
    <Dashboard
      searchQuery={searchQuery}
      pageSize={pageSize}
    />
  );
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards `pageSize` to {@link VehicleRegistry}.
 */
function VehicleRegistryPage() {
  const { pageSize } = useOutletContext<LayoutContext>();
  return <VehicleRegistry pageSize={pageSize} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it to {@link Trips}.
 */
function TripsPage() {
  const { searchQuery, pageSize, onNewTrip } = useOutletContext<LayoutContext>();
  return <Trips searchQuery={searchQuery} pageSize={pageSize} onNewTrip={onNewTrip} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards `pageSize` to {@link TripDispatcher}.
 */
function TripDispatcherPage() {
  const { pageSize } = useOutletContext<LayoutContext>();
  return <TripDispatcher pageSize={pageSize} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it to {@link Maintenance}.
 */
function MaintenancePage() {
  const { searchQuery, pageSize } = useOutletContext<LayoutContext>();
  return <Maintenance searchQuery={searchQuery} pageSize={pageSize} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it to {@link Performance}.
 */
function PerformancePage() {
  const { searchQuery, pageSize } = useOutletContext<LayoutContext>();
  return <Performance searchQuery={searchQuery} pageSize={pageSize} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it to {@link TripExpense}.
 */
function TripExpensePage() {
  const { searchQuery, pageSize } = useOutletContext<LayoutContext>();
  return <TripExpense searchQuery={searchQuery} pageSize={pageSize} />;
}

/**
 * Thin wrapper that reads the shared layout context from
 * the `<Outlet />` and forwards it to {@link Analytics}.
 */
function AnalyticsPage() {
  const { searchQuery, pageSize } = useOutletContext<LayoutContext>();
  return <Analytics searchQuery={searchQuery} pageSize={pageSize} />;
}

export default App;

