import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import type { KpiCard } from "@/lib/demo-dashboard";

const DELTA_STYLES = {
  up: { icon: ArrowUpRight, className: "text-good" },
  down: { icon: ArrowDownRight, className: "text-critical" },
  neutral: { icon: Minus, className: "text-subtle-foreground" },
} as const;

export function StatCard({ kpi }: { kpi: KpiCard }) {
  const delta = DELTA_STYLES[kpi.deltaDirection];
  const DeltaIcon = delta.icon;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <Tooltip label={kpi.tooltip}>
        <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
      </Tooltip>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
      <p className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${delta.className}`}>
        <DeltaIcon className="h-3.5 w-3.5" strokeWidth={2} />
        {kpi.deltaLabel}
      </p>
    </div>
  );
}
