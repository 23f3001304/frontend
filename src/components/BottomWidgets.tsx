/**
 * @module BottomWidgets
 * Three-column widget strip at the bottom of the dashboard:
 *  1. Vehicle Types breakdown (progress bars).
 *  2. Recent Alerts list.
 *  3. Download Report card.
 *
 * Each card stagger-animates in on mount; progress bars animate
 * their widths with GSAP.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { VehicleTypeBreakdown, Alert } from "../types";
import { useHoverLift, useClickPop } from "../hooks/useGsap";
import { staggerFadeIn, animateProgress } from "../lib/animations";
import { reportService } from "../services";
import { downloadBlob } from "../lib/download";
import { Can } from "./PermissionGate";

/** Placeholder handler — logs alert text to the console. */
const handleAlertClick = (message: string) => console.log("Alert clicked:", message);
/** Export fleet report as PDF via ReportService. */
const handleExportPDF = async () => {
  const blob = await reportService.exportFleetPDF();
  downloadBlob(blob, "fleet-report.pdf");
};

/** Props for the {@link BottomWidgets} component. */
interface BottomWidgetsProps {
  /** Breakdown of fleet by vehicle category. */
  vehicleTypes: VehicleTypeBreakdown[];
  /** Recent alert messages. */
  alerts: Alert[];
}

/**
 * Three-column bottom widget strip.
 * Stagger-fades all three cards in on mount.
 */
export default function BottomWidgets({
  vehicleTypes,
  alerts,
}: BottomWidgetsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(gridRef.current!, ":scope > *", { y: 18, duration: 0.45 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <VehicleTypesCard types={vehicleTypes} />
      <RecentAlertsCard alerts={alerts} />
      <DownloadReportCard />
    </div>
  );
}

/**
 * Animated progress-bar widget showing fleet composition.
 * Bars grow from 0% to their target width on mount.
 */
function VehicleTypesCard({ types }: { types: VehicleTypeBreakdown[] }) {
  const hover = useHoverLift();
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      types.forEach((t, i) => {
        const el = barRefs.current[i];
        if (el) animateProgress(el, t.percentage, { delay: 0.3 + i * 0.15 });
      });
    });
    return () => ctx.revert();
  }, [types]);

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm will-change-transform"
      {...hover}
    >
      <h4 className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-4">
        Vehicle Types
      </h4>
      <div className="space-y-2">
        {types.map((t, i) => (
          <div key={t.label} className="flex items-center space-x-4">
            <div className="w-2/3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                ref={(el) => { barRefs.current[i] = el; }}
                className={`h-full ${t.color} rounded-full`}
                style={{ width: 0 }}
              />
            </div>
            <span className="text-xs font-semibold text-text-light dark:text-text-dark">
              {t.percentage}% {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Recent alerts widget. Items are clickable with a pop animation.
 */
function RecentAlertsCard({ alerts }: { alerts: Alert[] }) {
  const hover = useHoverLift();
  const pop = useClickPop();

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm will-change-transform"
      {...hover}
    >
      <h4 className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-4">
        Recent Alerts
      </h4>
      <ul className="space-y-3">
        {alerts.map((alert, i) => (
          <li
            key={i}
            className="flex items-start text-xs text-text-light dark:text-text-dark cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleAlertClick(alert.message)}
            {...pop}
          >
            <span
              className={`w-2 h-2 mt-1 mr-2 rounded-full ${alert.color} shrink-0`}
            />
            {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Download report card with export-as-PDF action.
 */
function DownloadReportCard() {
  const hover = useHoverLift();
  const pop = useClickPop();

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex items-center justify-center sm:col-span-2 lg:col-span-1 will-change-transform"
      {...hover}
    >
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark mb-2">
          download
        </span>
        <p className="text-sm text-text-light dark:text-text-dark font-medium">
          Download Daily Report
        </p>
        <Can permission="analytics:export">
          <button
            className="mt-3 text-xs text-primary font-medium hover:underline"
            onClick={handleExportPDF}
            {...pop}
          >
            Export as PDF
          </button>
        </Can>
      </div>
    </div>
  );
}
