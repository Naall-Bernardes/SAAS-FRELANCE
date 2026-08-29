"use client";

/**
 * Gráfico de linhas — lucro líquido projetado mês a mês (1..N) para os 3
 * cenários. Cor por status (não categórica arbitrária): os cenários são
 * ordinais — pior/médio/melhor —, então usam os mesmos tokens critical/
 * warning/good já usados nos badges de cenário do resto do módulo.
 * Ver skill de dataviz: linhas finas (2px), zero-line recessiva, legenda
 * sempre presente para >=2 séries, rótulo direto só no ponto final
 * (nunca em todo ponto), crosshair + tooltip no hover.
 */

import { useMemo, useState } from "react";
import type { MonthlyProfitProjectionPoint } from "@/lib/auction-financing-calculator";
import { DEFAULT_SCENARIOS } from "@/lib/auction-calculator";
import { formatCurrency } from "@/lib/format";

const SCENARIO_COLOR: Record<string, string> = {
  pessimista: "var(--critical)",
  medio: "var(--warning)",
  otimista: "var(--good)",
};

const WIDTH = 680;
const HEIGHT = 260;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export function ProfitProjectionChart({
  data,
  highlightMonth,
}: {
  data: MonthlyProfitProjectionPoint[];
  /** mês (tempo até a revenda informado pelo usuário) marcado no eixo X */
  highlightMonth?: number;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const scenarios = DEFAULT_SCENARIOS;

  const { minY, maxY, points } = useMemo(() => {
    const allValues = data.flatMap((d) => scenarios.map((s) => d.profitByScenario[s.key] ?? 0));
    const min = Math.min(0, ...allValues);
    const max = Math.max(0, ...allValues);
    const span = max - min || 1;
    const paddedMin = min - span * 0.08;
    const paddedMax = max + span * 0.08;

    const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

    function x(i: number) {
      return PAD_LEFT + (data.length <= 1 ? 0 : (i / (data.length - 1)) * innerW);
    }
    function y(value: number) {
      const t = (value - paddedMin) / (paddedMax - paddedMin);
      return PAD_TOP + innerH * (1 - t);
    }

    return { minY: paddedMin, maxY: paddedMax, points: { x, y } };
  }, [data, scenarios]);

  const zeroY = points.y(0);
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
    const ratio = Math.min(1, Math.max(0, (relX - PAD_LEFT) / innerW));
    const idx = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.min(data.length - 1, Math.max(0, idx)));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4">
        {scenarios.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SCENARIO_COLOR[s.key] }} />
            {s.label}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Lucro líquido projetado por mês, para os cenários pessimista, médio e otimista"
      >
        {/* zero line */}
        <line
          x1={PAD_LEFT}
          x2={WIDTH - PAD_RIGHT}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={WIDTH - PAD_RIGHT} y={zeroY - 4} textAnchor="end" className="fill-subtle-foreground text-[10px]">
          R$ 0
        </text>

        {/* marcador do prazo estimado pelo usuário */}
        {highlightMonth && highlightMonth >= 1 && highlightMonth <= data.length && (
          <line
            x1={points.x(highlightMonth - 1)}
            x2={points.x(highlightMonth - 1)}
            y1={PAD_TOP}
            y2={HEIGHT - PAD_BOTTOM}
            stroke="var(--accent)"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.6}
          />
        )}

        {scenarios.map((s) => {
          const d = data
            .map((point, i) => `${i === 0 ? "M" : "L"} ${points.x(i)} ${points.y(point.profitByScenario[s.key] ?? 0)}`)
            .join(" ");
          const last = data[data.length - 1];
          return (
            <g key={s.key}>
              <path d={d} fill="none" stroke={SCENARIO_COLOR[s.key]} strokeWidth={2} strokeLinecap="round" />
              {last && (
                <circle
                  cx={points.x(data.length - 1)}
                  cy={points.y(last.profitByScenario[s.key] ?? 0)}
                  r={3}
                  fill={SCENARIO_COLOR[s.key]}
                />
              )}
            </g>
          );
        })}

        {/* eixo X: rótulos a cada 6 meses */}
        {data
          .filter((_, i) => i % 6 === 0 || i === data.length - 1)
          .map((point) => (
            <text
              key={point.month}
              x={points.x(point.month - 1)}
              y={HEIGHT - PAD_BOTTOM + 16}
              textAnchor="middle"
              className="fill-subtle-foreground text-[10px]"
            >
              {point.month}m
            </text>
          ))}

        {/* crosshair de hover */}
        {hovered && (
          <line
            x1={points.x(hovered.month - 1)}
            x2={points.x(hovered.month - 1)}
            y1={PAD_TOP}
            y2={HEIGHT - PAD_BOTTOM}
            stroke="var(--muted-foreground)"
            strokeWidth={1}
          />
        )}
      </svg>

      {hovered ? (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-surface-hover px-3 py-2 text-xs">
          <span className="font-semibold text-foreground">Mês {hovered.month}</span>
          {scenarios.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SCENARIO_COLOR[s.key] }} />
              <span className="text-muted-foreground">{s.label}:</span>
              <span className="font-medium text-foreground">{formatCurrency(hovered.profitByScenario[s.key] ?? 0)}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-subtle-foreground">
          Passe o mouse sobre o gráfico pra ver o lucro projetado mês a mês
          {highlightMonth ? ` — a linha pontilhada marca os ${highlightMonth} meses que você definiu acima.` : "."}
        </p>
      )}
      <p className="sr-only">
        Faixa de valores no eixo Y: de {formatCurrency(minY)} a {formatCurrency(maxY)}.
      </p>
    </div>
  );
}
