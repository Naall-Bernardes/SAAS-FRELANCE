"use client";

export function NumberField({
  label,
  value,
  onChange,
  hint,
  step = 100,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
        {label}
      </label>
      {suffix ? (
        <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
          <input
            type="number"
            inputMode="decimal"
            step={step}
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="w-full min-w-0 bg-transparent px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          <span className="pr-3 text-xs text-subtle-foreground">{suffix}</span>
        </div>
      ) : (
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      )}
      {hint && <p className="mt-1 text-xs text-subtle-foreground">{hint}</p>}
    </div>
  );
}
