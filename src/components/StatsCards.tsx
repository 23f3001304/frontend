/**
 * @module StatsCards
 * Renders a responsive 4-column grid of KPI stat cards.
 * Each card animates in with a staggered fade-slide and
 * lifts on hover via GSAP.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { StatCard as StatCardType } from "../types";
import { useHoverLift, useClickPop } from "../hooks/useGsap";
import { staggerFadeIn, countUp } from "../lib/animations";

/** Props accepted by the {@link StatsCards} component. */
interface StatsCardsProps {
  /** Array of four stat card data objects. */
  cards: StatCardType[];
}

/**
 * Grid of KPI stat cards at the top of the dashboard.
 * Children stagger-animate in on mount.
 */
export default function StatsCards({ cards }: StatsCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(gridRef.current!, ":scope > *", { y: 20, duration: 0.45 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <StatCard key={card.label} card={card} />
      ))}
    </div>
  );
}

/**
 * Individual KPI stat card with hover-lift and click-pop animations.
 * Numeric values count-up from 0 on mount.
 */
function StatCard({ card }: { card: StatCardType }) {
  const hover = useHoverLift();
  const pop = useClickPop();
  const valueRef = useRef<HTMLDivElement>(null);

  // Count-up animation for numeric values
  useEffect(() => {
    if (!valueRef.current) return;
    const numericValue = typeof card.value === "number" ? card.value : parseInt(String(card.value), 10);
    if (isNaN(numericValue)) return;
    const ctx = gsap.context(() => {
      countUp(valueRef.current!, numericValue, { duration: 1.2 });
    });
    return () => ctx.revert();
  }, [card.value]);

  return (
    <div
      className="bg-surface-light dark:bg-surface-dark overflow-hidden rounded-xl shadow-sm border border-border-light dark:border-border-dark cursor-pointer will-change-transform"
      {...hover}
      {...pop}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="shrink-0">
            <span
              className={`material-symbols-outlined ${card.iconColor} text-3xl ${card.iconBg} p-2 rounded-lg`}
            >
              {card.icon}
            </span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark truncate">
                {card.label}
              </dt>
              <dd>
                <div
                  ref={valueRef}
                  className="text-2xl font-bold text-text-light dark:text-text-dark"
                >
                  {card.value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
        <div className={`text-xs ${card.footerColor} font-medium`}>
          {card.footer}
        </div>
      </div>
    </div>
  );
}
