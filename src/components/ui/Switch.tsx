"use client";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Switch({ checked, onChange, label = "Ativar/desativar" }: SwitchProps) {
  return (
    <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="h-5 w-9 rounded-full bg-surface-hover transition-colors peer-checked:bg-accent" />
      <span className="absolute left-0.5 h-4 w-4 rounded-full bg-surface shadow transition-transform peer-checked:translate-x-4" />
    </label>
  );
}
