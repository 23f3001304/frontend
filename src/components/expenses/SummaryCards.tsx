/**
 * @module expenses/SummaryCards
 * Three outlined summary metric cards for the Expense page.
 * Styled differently from the main StatsCards — uses a simple
 * outlined card with large value and small label.
 */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { staggerFadeIn } from "../../lib/animations";

interface SummaryCard {
  /** Card label (e.g. "Total Fuel Cost (This Month)"). */
  label: string;
  /** Formatted display value (e.g. "$12,450"). */
  value: string;
}

interface SummaryCardsProps {
  /** Array of summary card data objects. */
  cards: SummaryCard[];
}

/** Row of outlined summary metric cards. */
export default function SummaryCards({ cards }: SummaryCardsProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      staggerFadeIn(gridRef.current!, ":scope > *", { y: 16, duration: 0.35 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-5"
        >
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-1">
            {card.label}
          </p>
          <p className="text-2xl font-bold text-text-light dark:text-text-dark">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
