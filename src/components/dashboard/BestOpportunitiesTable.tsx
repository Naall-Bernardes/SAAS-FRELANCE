"use client";

import { Bookmark, ExternalLink, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { formatCurrency } from "@/lib/format";
import { useSavedOpportunities } from "@/lib/use-saved-opportunities";
import { DEMO_OPPORTUNITIES } from "@/lib/demo-opportunities";

const BEST = [...DEMO_OPPORTUNITIES].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);

export function BestOpportunitiesTable() {
  const { saved, toggle } = useSavedOpportunities();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-subtle-foreground">
            <th scope="col" className="px-4 py-3 font-medium">
              Oportunidade
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Valor
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Match IA
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Concorrentes
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Publicado
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Prioridade
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {BEST.map((op) => {
            const priorityVariant = op.priority === "Alta" ? "critical" : op.priority === "Média" ? "warning" : "neutral";
            const isSaved = saved.has(op.id);
            return (
              <tr key={op.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                <td className="max-w-[240px] px-4 py-3">
                  <p className="truncate font-medium text-foreground">{op.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{op.platform}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {formatCurrency(op.value, op.currency)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={op.matchScore >= 85 ? "good" : op.matchScore >= 70 ? "warning" : "critical"}>
                    {op.matchScore}%
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{op.competitorsCount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  <RelativeTime date={op.publishedAt} />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={priorityVariant}>{op.priority}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <a
                      href={op.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Ver oportunidade"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                    <a
                      href={`/gerador-propostas?opportunidade=${op.id}`}
                      title="Gerar proposta"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    >
                      <Wand2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                    <button
                      type="button"
                      onClick={() => toggle(op.id)}
                      aria-pressed={isSaved}
                      title={isSaved ? "Remover dos salvos" : "Salvar"}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                        isSaved ? "text-accent" : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" strokeWidth={1.75} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
