/**
 * @module analytics/KpiCards
 * Four KPI stat cards for the Operational Analytics page.
 *
 * Each card has:
 *  - Coloured icon container.
 *  - Badge (green "+4.2%", blue "Stable", red "-2.1%", etc.).
 *  - Label and large value.
 *
 * Cards stagger in with GSAP on mount.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { staggerFadeIn } from "../../lib/animations";
import { useHoverLift, useClickPop } from "../../hooks/useGsap";
import type { KpiCardConfig, BadgeVariant } from "./constants";

interface KpiCardsProps {
  cards: KpiCardConfig[];
}

const badgeClasses: Record<BadgeVariant, string> = {
  positive: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  negative: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  neutral: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function KpiCards({ cards }: KpiCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(gridRef.current!, ":scope > *", { y: 20, duration: 0.45 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
    >
      {cards.map((card) => (
        <KpiCard key={card.label} card={card} />
      ))}
    </div>
  );
}

function KpiCard({ card }: { card: KpiCardConfig }) {
  const hover = useHoverLift();
  const pop = useClickPop();

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5 cursor-pointer will-change-transform"
      {...hover}
      {...pop}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`material-symbols-outlined text-2xl ${card.iconColor} ${card.iconBg} p-2 rounded-lg`}
        >
          {card.icon}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClasses[card.badgeVariant]}`}
        >
          {card.badge}
        </span>
      </div>
      <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">
        {card.label}
      </p>
      <p className="text-2xl font-bold text-text-light dark:text-text-dark">
        {card.value}
      </p>
    </div>
  );
}
