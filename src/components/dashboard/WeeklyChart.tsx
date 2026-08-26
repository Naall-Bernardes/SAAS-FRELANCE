"use client";

import { useState } from "react";
import type { DailyCount } from "@/lib/demo-dashboard";

/**
 * Colunas verticais para tendência ao longo do tempo — cor única
 * sequencial (accent), com rótulo direto no topo e tooltip por barra.
 */
export function WeeklyChart({ data }: { data: DailyCount[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-40 items-end gap-2 sm:gap-3">
      {data.map((d, i) => {
        const pct = Math.max((d.count / max) * 100, 4);
        const isHovered = hovered === i;
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.label}
            className="group relative flex flex-1 flex-col items-center gap-1.5 outline-none"
            tabIndex={0}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
          >
            {isHovered && (
              <div
                role="tooltip"
                className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-medium text-background shadow-popover"
              >
                {d.count} vagas
              </div>
            )}
            <div className="flex h-32 w-full items-end rounded-md bg-surface-hover">
              <div
                className="w-full rounded-md transition-[height,opacity] duration-200"
                style={{
                  height: `${pct}%`,
                  backgroundColor: "var(--accent)",
                  opacity: hovered === null || isHovered ? (isLast ? 1 : 0.7) : 0.35,
                }}
              />
            </div>
            <span className="text-[11px] font-medium text-subtle-foreground">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
