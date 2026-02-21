/**
 * @module analytics/FuelEfficiencyChart
 * Bar chart visualising daily (or weekly) fuel efficiency over 30 days.
 *
 * Pure CSS/TailwindCSS bars — no charting library dependency.
 * Animates bars in with GSAP stagger on mount and on toggle.
 */

import { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import type { FuelEfficiencyDataPoint } from "../../types";

interface FuelEfficiencyChartProps {
  data: FuelEfficiencyDataPoint[];
}

/** Aggregate daily data into weekly buckets (every 5-ish points). */
function toWeekly(data: FuelEfficiencyDataPoint[]): FuelEfficiencyDataPoint[] {
  const weeks: FuelEfficiencyDataPoint[] = [];
  for (let i = 0; i < data.length; i += 5) {
    const slice = data.slice(i, i + 5);
    const avg = Math.round(slice.reduce((s, d) => s + d.value, 0) / slice.length);
    weeks.push({ label: slice[0].label, value: avg });
  }
  return weeks;
}

export default function FuelEfficiencyChart({ data }: FuelEfficiencyChartProps) {
  const [view, setView] = useState<"Daily" | "Weekly">("Daily");
  const barsRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(
    () => (view === "Daily" ? data : toWeekly(data)),
    [data, view],
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.value), 1),
    [chartData],
  );

  // Animate bars on mount and when view changes
  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll("[data-bar]");
    const ctx = gsap.context(() => {
      gsap.from(bars, {
        scaleY: 0,
        transformOrigin: "bottom",
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.02,
      });
    });
    return () => ctx.revert();
  }, [view]);

  // Show every Nth label to avoid overcrowding
  const labelInterval = view === "Daily" ? 5 : 1;

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
            Fuel Efficiency Trends
          </h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Performance history over the last 30 days
          </p>
        </div>
        {/* Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {(["Daily", "Weekly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                view === v
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-end mt-6" ref={barsRef}>
        <div className="flex items-end gap-0.75 w-full h-48">
          {chartData.map((d, i) => (
            <div
              key={`${d.label}-${i}`}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                data-bar
                className="w-full rounded-t bg-blue-500 dark:bg-blue-400 min-h-1"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex mt-2">
        {chartData.map((d, i) => (
          <div key={`lbl-${i}`} className="flex-1 text-center">
            {i % labelInterval === 0 ? (
              <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark">
                {d.label}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
