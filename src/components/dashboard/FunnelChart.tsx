import type { FunnelStage } from "@/lib/demo-dashboard";

/** Funil simples: largura proporcional ao topo, opacidade decrescente — mesma cor, mesmo hue. */
export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = stages[0]?.count || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = Math.max((stage.count / max) * 100, 6);
        const prev = i > 0 ? stages[i - 1].count : null;
        const conversion = prev ? Math.round((stage.count / prev) * 100) : null;
        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-baseline justify-between text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="text-muted-foreground">
                {stage.count}
                {conversion !== null && (
                  <span className="ml-1.5 text-xs text-subtle-foreground">({conversion}%)</span>
                )}
              </span>
            </div>
            <div className="h-6 w-full rounded-md bg-surface-hover">
              <div
                className="h-6 rounded-md transition-[width] duration-300"
                style={{ width: `${pct}%`, backgroundColor: "var(--accent)", opacity: 1 - i * 0.14 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
