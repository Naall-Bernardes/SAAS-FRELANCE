import { Clock, Sparkles, Target, Users, type LucideIcon } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { formatCurrency } from "@/lib/format";
import type { DemoOpportunity } from "@/lib/demo-opportunities";

export function RadarCard({
  op,
  badgeLabel,
  badgeVariant,
}: {
  op: DemoOpportunity;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{op.title}</h3>
        <Badge variant={badgeVariant} className="shrink-0">
          {badgeLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Sparkles} label="Match" value={`${op.matchScore}%`} />
        <Stat icon={Target} label="Contratação" value={`${op.hireChance}%`} />
        <Stat icon={Users} label="Concorrência" value={op.competitionLevel} />
        <Stat label="Valor" value={formatCurrency(op.value, op.currency)} />
      </div>

      <p className="inline-flex items-center gap-1 text-xs text-subtle-foreground">
        <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
        Publicado <RelativeTime date={op.publishedAt} /> · {op.platform}
      </p>

      <a
        href={op.url}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Ver oportunidade
      </a>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon?: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 text-[11px] text-subtle-foreground">
        {Icon && <Icon className="h-3 w-3" strokeWidth={1.75} />}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
