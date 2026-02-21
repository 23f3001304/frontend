/**
 * @module analytics/ExportReports
 * Side panel with three export action cards: CSV, PDF, and Email.
 *
 * Each card triggers a stub service call and shows a brief toast-style
 * notification (console.log for now).
 */

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { staggerFadeIn } from "../../lib/animations";
import { useHoverLift, useClickPop } from "../../hooks/useGsap";
import { analyticsService } from "../../services";
import { downloadBlob } from "../../lib/download";

export default function ExportReports() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(containerRef.current!, ":scope > .export-card", {
        y: 14,
        duration: 0.35,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleCSV = useCallback(async () => {
    const blob = await analyticsService.exportCSV([]);
    downloadBlob(blob, "analytics-report.csv");
  }, []);

  const handlePDF = useCallback(async () => {
    const blob = await analyticsService.exportPDF();
    downloadBlob(blob, "analytics-report.pdf");
  }, []);

  const handleEmail = useCallback(async () => {
    await analyticsService.emailReport();
  }, []);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
      <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
        Export Reports
      </h3>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-5">
        Download consolidated data for auditing and regulatory compliance.
      </p>

      <div ref={containerRef} className="space-y-3">
        <ExportCard
          icon="description"
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
          title="CSV Format"
          subtitle="Detailed raw log"
          actionIcon="download"
          onClick={handleCSV}
        />
        <ExportCard
          icon="picture_as_pdf"
          iconBg="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
          title="PDF Report"
          subtitle="Executive Summary"
          actionIcon="download"
          onClick={handlePDF}
        />
        <ExportCard
          icon="mail"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          title="Email Report"
          subtitle="Send to Stakeholders"
          actionIcon="send"
          onClick={handleEmail}
        />
      </div>
    </div>
  );
}

/* ─── Sub-component ─── */

interface ExportCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionIcon: string;
  onClick: () => void;
}

function ExportCard({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  actionIcon,
  onClick,
}: ExportCardProps) {
  const hover = useHoverLift();
  const pop = useClickPop();

  return (
    <button
      onClick={onClick}
      className="export-card w-full flex items-center gap-4 p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left will-change-transform"
      {...hover}
      {...pop}
    >
      <span
        className={`material-symbols-outlined text-2xl ${iconColor} ${iconBg} p-2.5 rounded-lg shrink-0`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-light dark:text-text-dark">
          {title}
        </p>
        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
          {subtitle}
        </p>
      </div>
      <span className="material-symbols-outlined text-lg text-text-muted-light dark:text-text-muted-dark">
        {actionIcon}
      </span>
    </button>
  );
}
