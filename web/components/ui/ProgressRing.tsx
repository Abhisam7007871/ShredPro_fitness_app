import React from "react";

type Props = {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
};

export default function ProgressRing({
  progress,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
}: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - p);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgb(var(--border))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          className="text-primary drop-shadow-[0_0_18px_rgba(77,170,86,0.25)]"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && (
          <div className="text-3xl font-black text-text-main leading-none">
            {label}
          </div>
        )}
        {sublabel && (
          <div className="mt-2 text-xs font-bold uppercase tracking-widest text-text-muted">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

