/**
 * @module analytics/ROIAnalysis
 * Vehicle ROI Analysis panel showing fleet margin breakdowns.
 *
 * Each fleet row displays:
 *  - Label (e.g. "Fleet A (Heavy Duty)")
 *  - Margin % badge
 *  - Horizontal progress bar
 *  - REV / COST labels
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { staggerFadeIn } from "../../lib/animations";
import { useClickPop } from "../../hooks/useGsap";
import type { FleetROI } from "../../types";
import { marginColor, marginBarColor } from "./constants";

interface ROIAnalysisProps {
  fleets: FleetROI[];
}

export default function ROIAnalysis({ fleets }: ROIAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pop = useClickPop();

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(containerRef.current!, ":scope > .fleet-row", {
        y: 12,
        duration: 0.35,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 flex flex-col">
      <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
        Vehicle ROI Analysis
      </h3>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-5">
        Revenue vs Operational Costs
      </p>

      <div ref={containerRef} className="space-y-5 flex-1">
        {fleets.map((fleet) => (
          <div key={fleet.label} className="fleet-row">
            {/* Label + margin badge */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-text-light dark:text-text-dark">
                {fleet.label}
              </span>
              <span className={`text-sm font-bold ${marginColor(fleet.margin)}`}>
                {fleet.margin}% Margin
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full ${marginBarColor(fleet.margin)} transition-all duration-500`}
                style={{ width: `${fleet.margin}%` }}
              />
            </div>

            {/* REV / COST */}
            <div className="flex justify-between text-xs text-text-muted-light dark:text-text-muted-dark">
              <span>
                REV: <span className="font-medium text-text-light dark:text-text-dark">{fleet.rev}</span>
              </span>
              <span>
                COST: <span className="font-medium text-text-light dark:text-text-dark">{fleet.cost}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer button */}
      <button
        {...pop}
        className="mt-5 w-full py-2.5 border border-border-light dark:border-border-dark rounded-lg text-sm font-medium text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        View Detailed Breakdown
      </button>
    </div>
  );
}
