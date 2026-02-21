/**
 * @module drivers/SafetyScoreRing
 * Circular progress indicator for driver safety score.
 */

import { safetyScoreColor, safetyScoreTextColor } from "./constants";

interface SafetyScoreRingProps {
  /** Safety score percentage (0–100). */
  score: number;
  /** Ring diameter in pixels (default: 44). */
  size?: number;
}

/** Circular progress ring showing a driver's safety score. */
export default function SafetyScoreRing({ score, size = 44 }: SafetyScoreRingProps) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Foreground arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={safetyScoreColor(score)}
        />
      </svg>
      <span
        className={`absolute text-xs font-bold ${safetyScoreTextColor(score)}`}
      >
        {score}%
      </span>
    </div>
  );
}
