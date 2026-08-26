"use client";

import { useState } from "react";

/**
 * Gráfico de barras horizontais para comparar magnitude entre categorias
 * (ex: número de vagas por categoria/fonte). Cor única sequencial — as
 * barras SÃO as categorias, então uma paleta categórica não se aplica aqui
 * (ver skill de dataviz: "categórica é para quando as séries são o assunto").
 *
 * Uma única série não precisa de legenda — o título do card já diz o que é.
 * O valor fica sempre visível no rótulo direto (nunca só na cor).
 */

export interface BarDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDatum[];
  /** cor da paleta (slot 1 / azul por padrão) */
  color?: string;
  valueFormatter?: (value: number) => string;
}

const DEFAULT_COLOR = "var(--accent)"; // paleta: categórico slot 1 / hue sequencial padrão

export function BarChart({ data, color = DEFAULT_COLOR, valueFormatter }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const format = valueFormatter ?? ((v: number) => v.toLocaleString("pt-BR"));

  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const pct = Math.max((d.value / max) * 100, 2); // piso visual p/ valores pequenos não sumirem
        const isHovered = hovered === i;
        return (
          <div
            key={d.label}
            className="group relative flex items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            tabIndex={0}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
          >
            <span className="w-32 shrink-0 truncate text-sm text-muted-foreground sm:w-40" title={d.label}>
              {d.label}
            </span>

            <div className="relative h-5 flex-1 rounded bg-surface-hover">
              <div
                className="h-5"
                style={{
                  width: `${pct}%`,
                  backgroundColor: color,
                  borderRadius: "0 4px 4px 0",
                  opacity: hovered === null || isHovered ? 1 : 0.5,
                  transition: "opacity 120ms ease, width 200ms ease",
                }}
              />

              {isHovered && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute -top-9 z-10 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background shadow-popover"
                  style={{ left: `min(${pct}%, 80%)` }}
                >
                  <strong className="font-semibold">{format(d.value)}</strong>{" "}
                  <span className="opacity-75">{d.label}</span>
                </div>
              )}
            </div>

            <span className="w-10 shrink-0 text-right text-sm font-medium text-foreground">{format(d.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
