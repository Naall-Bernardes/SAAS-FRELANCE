import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { BarChart } from "@/components/BarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/format";
import {
  AI_TRENDS,
  AVG_VALUE_BY_TECH,
  GROWING_CATEGORIES,
  MARKET_STATS,
  PLATFORMS_BY_VOLUME,
  TOP_SKILLS,
} from "@/lib/market";

export default function MercadoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Mercado</h1>
        <p className="mt-1 text-sm text-muted-foreground">Inteligência de mercado sobre o ecossistema de freelance.</p>
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> os números desta tela ilustram o formato final — eles passam a
        refletir o volume real de oportunidades quando o Supabase estiver conectado.
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <StatCard
          kpi={{
            label: "Média de concorrentes por vaga",
            value: String(MARKET_STATS.avgCompetitors),
            deltaLabel: "em todas as categorias",
            deltaDirection: "neutral",
            tooltip: "Número médio de freelancers concorrendo a cada oportunidade publicada.",
          }}
        />
        <StatCard
          kpi={{
            label: "Ticket médio geral",
            value: formatCurrency(MARKET_STATS.avgTicket),
            deltaLabel: "todas as plataformas",
            deltaDirection: "neutral",
            tooltip: "Valor médio das oportunidades publicadas, considerando todas as categorias e fontes.",
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold text-foreground">Skills mais procuradas</h2>
          <BarChart data={TOP_SKILLS} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold text-foreground">Plataformas com mais oportunidades</h2>
          <BarChart data={PLATFORMS_BY_VOLUME} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold text-foreground">Valor médio por tecnologia</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-subtle-foreground">
                <th scope="col" className="pb-2 font-medium">Tecnologia</th>
                <th scope="col" className="pb-2 text-right font-medium">Valor médio</th>
              </tr>
            </thead>
            <tbody>
              {AVG_VALUE_BY_TECH.map((row) => (
                <tr key={row.tech} className="border-t border-border">
                  <td className="py-2 text-foreground">{row.tech}</td>
                  <td className="py-2 text-right font-medium text-foreground">{formatCurrency(row.avgValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold text-foreground">Categorias em crescimento</h2>
          <ul className="space-y-2.5">
            {GROWING_CATEGORIES.map((c) => {
              const up = c.growthPercent >= 0;
              return (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.category}</span>
                  <span className={`inline-flex items-center gap-1 font-medium ${up ? "text-good" : "text-critical"}`}>
                    {up ? (
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    {Math.abs(c.growthPercent)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
          Tendências identificadas pela IA
        </h2>
        <ul className="space-y-3">
          {AI_TRENDS.map((trend) => (
            <li key={trend} className="rounded-xl border border-border bg-background p-3 text-sm text-foreground">
              {trend}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
