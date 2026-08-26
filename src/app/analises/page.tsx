import { getAnalyticsData } from "@/lib/data";
import { BarChart } from "@/components/BarChart";
import { StatTile } from "@/components/StatTile";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

export default async function AnalisesPage() {
  const { totalOpportunities, activeSources, avgBudget, byCategory, bySource, usingMockData } =
    await getAnalyticsData();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Análises</h1>
        <p className="mt-1 text-sm text-muted-foreground">Número de vagas apresentadas por categoria e por fonte.</p>
      </header>

      {usingMockData && (
        <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
          <strong>Modo demonstração:</strong> nenhum banco de dados conectado. Números calculados a partir dos
          dados de exemplo — conecte o Supabase para ver as análises reais.
        </div>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Vagas encontradas" value={totalOpportunities.toLocaleString("pt-BR")} />
        <StatTile label="Fontes ativas" value={String(activeSources)} />
        <StatTile label="Categorias" value={String(byCategory.length)} />
        <StatTile
          label="Orçamento médio"
          value={avgBudget != null ? currencyFormatter.format(avgBudget) : "—"}
          hint={avgBudget != null ? "budgetMin, todas as moedas" : undefined}
        />
      </section>

      <ChartCard title="Vagas por categoria" data={byCategory.map((c) => ({ label: c.category, value: c.count }))} columnLabel="Categoria" />

      <ChartCard title="Vagas por fonte" data={bySource.map((s) => ({ label: s.name, value: s.count }))} columnLabel="Fonte" />
    </div>
  );
}

function ChartCard({
  title,
  data,
  columnLabel,
}: {
  title: string;
  data: { label: string; value: number }[];
  columnLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem dados suficientes ainda. Rode uma sincronização primeiro.</p>
      ) : (
        <>
          <BarChart data={data} />

          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-muted-foreground">Ver como tabela</summary>
            <table className="mt-2 w-full text-left text-sm">
              <thead>
                <tr className="text-subtle-foreground">
                  <th scope="col" className="py-1 pr-4 font-medium">
                    {columnLabel}
                  </th>
                  <th scope="col" className="py-1 font-medium">
                    Vagas
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.label} className="border-t border-border">
                    <td className="py-1 pr-4 text-foreground">{d.label}</td>
                    <td className="py-1 text-foreground">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </section>
  );
}
