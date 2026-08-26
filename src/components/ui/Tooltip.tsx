"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Tooltip acessível para indicadores mais complexos (Match IA, chance de
 * contratação, deltas do dashboard etc.) — aparece no hover e no foco de
 * teclado, nunca só no hover.
 */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex">
      <span
        tabIndex={0}
        aria-describedby={id}
        className="inline-flex cursor-help items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium leading-snug text-background shadow-popover"
        >
          {label}
        </span>
      )}
    </span>
  );
}
