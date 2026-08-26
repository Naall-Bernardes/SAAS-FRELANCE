"use client";

import { Bookmark, Clock, ExternalLink, Sparkles, Target, Users, Wand2, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { formatCurrency } from "@/lib/format";
import { getQualityBadge, type DemoOpportunity } from "@/lib/demo-opportunities";

interface OpportunityCardProps {
  op: DemoOpportunity;
  saved: boolean;
  onToggleSave: () => void;
  onIgnore: () => void;
}

export function OpportunityCard({ op, saved, onToggleSave, onIgnore }: OpportunityCardProps) {
  const quality = getQualityBadge(op);
  const priorityVariant = op.priority === "Alta" ? "critical" : op.priority === "Média" ? "warning" : "neutral";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{op.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{op.summary}</p>
        </div>
        <Badge variant={quality.variant} className="shrink-0">
          <span aria-hidden="true">{quality.emoji}</span> {quality.label}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <Badge variant="neutral">{op.platform}</Badge>
        <span>{op.category}</span>
        <span className="font-semibold text-foreground">{formatCurrency(op.value, op.currency)}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
          <RelativeTime date={op.publishedAt} />
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {op.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-muted-foreground">
            {skill}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
        <Metric
          icon={Sparkles}
          label="Match IA"
          value={`${op.matchScore}%`}
          tooltip="Compatibilidade estimada entre esta oportunidade e o seu perfil cadastrado em Match IA."
        />
        <Metric
          icon={Target}
          label="Chance de contratação"
          value={`${op.hireChance}%`}
          tooltip="Probabilidade estimada de você ser contratado, considerando match, concorrência e histórico da plataforma."
        />
        <Metric
          icon={Users}
          label="Concorrência"
          value={`${op.competitorsCount} (${op.competitionLevel})`}
          tooltip="Número estimado de outros freelancers concorrendo a esta oportunidade."
        />
        <Metric label="Prioridade" value={op.priority} badgeVariant={priorityVariant} />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={op.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Analisar
        </a>
        <a
          href="/propostas"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Wand2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Gerar proposta
        </a>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            saved ? "border-accent bg-accent-soft text-accent" : "border-border text-foreground hover:bg-surface-hover"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" strokeWidth={1.75} fill={saved ? "currentColor" : "none"} />
          {saved ? "Salva" : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onIgnore}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-subtle-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          Ignorar
        </button>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tooltip,
  badgeVariant,
}: {
  icon?: typeof Sparkles;
  label: string;
  value: string;
  tooltip?: string;
  badgeVariant?: "critical" | "warning" | "neutral";
}) {
  const content = (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 text-[11px] text-subtle-foreground">
        {Icon && <Icon className="h-3 w-3" strokeWidth={1.75} />}
        {label}
      </span>
      {badgeVariant ? (
        <Badge variant={badgeVariant} className="w-fit">
          {value}
        </Badge>
      ) : (
        <span className="text-sm font-semibold text-foreground">{value}</span>
      )}
    </div>
  );

  if (!tooltip) return content;
  return <Tooltip label={tooltip}>{content}</Tooltip>;
}
