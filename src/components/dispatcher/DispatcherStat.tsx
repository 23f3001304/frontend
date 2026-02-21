/**
 * @module dispatcher/DispatcherStat
 * A stat card with animated count-up value — used in the stats row at the top
 * of the Trip Dispatcher page.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { countUp } from "../../lib/animations";

interface DispatcherStatProps {
  /** Material Symbols icon name. */
  icon: string;
  /** Tailwind text-colour class for the icon. */
  iconColor: string;
  /** Tailwind bg-colour class for the icon circle. */
  iconBg: string;
  /** Label text below the stat (e.g. "Draft / Pending"). */
  label: string;
  /** Numeric value – animated with GSAP countUp. */
  value: number;
}

export default function DispatcherStat({ icon, iconColor, iconBg, label, value }: DispatcherStatProps) {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!valueRef.current) return;
    const ctx = gsap.context(() => {
      countUp(valueRef.current!, value, { duration: 1 });
    });
    return () => ctx.revert();
  }, [value]);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</p>
        <div ref={valueRef} className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
          0
        </div>
      </div>
      <div className={`h-11 w-11 rounded-full flex items-center justify-center ${iconBg}`}>
        <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
      </div>
    </div>
  );
}
