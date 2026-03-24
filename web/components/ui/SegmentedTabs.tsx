import React from "react";
import clsx from "clsx";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export default function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className,
}: Props<T>) {
  return (
    <div
      className={clsx(
        "inline-flex rounded-2xl bg-surface-accent border border-[rgb(var(--border))] p-1 gap-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              active
                ? "bg-surface text-text-main shadow-[0_10px_26px_rgba(15,23,42,0.10)]"
                : "text-text-muted hover:text-text-main",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

