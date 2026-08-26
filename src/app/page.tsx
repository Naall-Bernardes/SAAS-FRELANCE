import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { BestOpportunitiesTable } from "@/components/dashboard/BestOpportunitiesTable";
import { DASHBOARD_KPIS, FUNNEL, LAST_7_DAYS } from "@/lib/demo-dashboard";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Início</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral das suas oportunidades de freelance agora.
        </p>
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> os números abaixo ilustram como o dashboard vai se comportar —
        eles passam a refletir dados reais quando o Supabase e o motor de Match IA forem conectados.
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {DASHBOARD_KPIS.map((kpi) => (
          <StatCard key={kpi.label} kpi={kpi} />
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Melhores oportunidades para você</h2>
          <a href="/oportunidades" className="text-sm font-medium text-accent hover:underline">
            Ver todas →
          </a>
        </div>
        <BestOpportunitiesTable />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-3">
          <h2 className="text-base font-semibold text-foreground">Oportunidades encontradas nos últimos 7 dias</h2>
          <p className="mb-4 text-sm text-muted-foreground">Volume diário de vagas novas em todas as suas buscas.</p>
          <WeeklyChart data={LAST_7_DAYS} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">Funil</h2>
          <p className="mb-4 text-sm text-muted-foreground">Encontradas → Analisadas → Propostas → Respostas → Contratações</p>
          <FunnelChart stages={FUNNEL} />
        </div>
      </section>
    </div>
  );
}
