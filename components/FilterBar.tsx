"use client";

/**
 * FilterBar.tsx — a row of pill buttons for filtering, used by Browse.
 *
 * Generic over the option value type so it's reusable for any single-select
 * filter (levels here, but topics/anything later). The parent owns the active
 * value and gets notified via onChange — this component holds no state itself.
 */

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterBarProps<T extends string> {
  options: readonly FilterOption<T>[];
  active: T;
  onChange: (value: T) => void;
}

export default function FilterBar<T extends string>({
  options,
  active,
  onChange,
}: FilterBarProps<T>) {
  return (
    <div className="filters">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`filter-btn ${active === value ? "active" : ""}`}
          aria-pressed={active === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
