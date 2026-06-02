/**
 * ProgressBar.tsx — reusable progress indicator.
 *
 * Pure presentational component (no client interactivity), so it can render
 * on the server. Two sizes:
 *   default — the 4px bar used on the dashboard / lesson cards
 *   mini    — the 3px bar under a lesson card (always teal, per the design)
 */

type Fill = "teal" | "gold" | "red";

interface ProgressBarProps {
  /** Fill percentage, 0–100. Clamped defensively. */
  value: number;
  /** Fill colour for the default size. Ignored by the mini variant. */
  fill?: Fill;
  /** Render the thin 3px variant used beneath lesson cards. */
  mini?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  fill = "teal",
  mini = false,
  className = "",
}: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%`;

  if (mini) {
    return (
      <div className={`progress-bar-mini ${className}`.trim()}>
        <div className="progress-bar-mini-fill" style={{ width }} />
      </div>
    );
  }

  return (
    <div className={`progress-bar ${className}`.trim()}>
      <div className={`progress-bar-fill fill-${fill}`} style={{ width }} />
    </div>
  );
}
