import Link from "next/link";
import { Building2, Car, Gavel } from "lucide-react";
import { StatTile } from "@/components/StatTile";
import { OpenCalculatorButton } from "@/components/auctions/OpenCalculatorButton";
import { formatCurrency } from "@/lib/format";
import { DEMO_IMOVEIS, DEMO_VEICULOS } from "@/lib/demo-auctions";

export default function LeiloesPage() {
  const totalLotes = DEMO_IMOVEIS.length + DEMO_VEICULOS.length;

  const avgDescontoImoveis = average(DEMO_IMOVEIS.map((i) => i.discountPct));
  const avgDescontoVeiculos = average(
    DEMO_VEICULOS.map((v) => (1 - v.currentBidValue / v.fipeValue) * 100)
  );
  const leiloesProximos7Dias = [...DEMO_IMOVEIS, ...DEMO_VEICULOS].filter(
    (item) => item.auctionDate.getTime() - Date.now() <= 7 * 86_400_000
  ).length;

  const menorLanceImovel = Math.min(...DEMO_IMOVEIS.map((i) => i.firstBidValue));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leilões</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Imóveis e veículos de leilão, com calculadora de rentabilidade e cenários pessimista/médio/otimista.
          </p>
        </div>
        <OpenCalculatorButton kind="imovel" label="Nova simulação" />
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> os lotes abaixo ilustram como o módulo vai se comportar. A busca ao
        vivo na Caixa e no Leilo ainda não está ligada — os dois sites não expõem uma listagem simples de raspar
        (ver comentários em <code>src/lib/auction-connectors/</code>), então por ora eles precisam de um navegador
        headless para funcionar de verdade.
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Lotes monitorados" value={`${totalLotes}`} />
        <StatTile label="Deságio médio — imóveis" value={`${avgDescontoImoveis.toFixed(0)}%`} hint="vs. avaliação" />
        <StatTile label="Deságio médio — veículos" value={`${avgDescontoVeiculos.toFixed(0)}%`} hint="vs. FIPE" />
        <StatTile label="Leilões em até 7 dias" value={`${leiloesProximos7Dias}`} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/leiloes/imoveis"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-popover"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Building2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Imóveis — Caixa</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Casas, apartamentos e terrenos de leilão/venda direta. {DEMO_IMOVEIS.length} imóveis monitorados,
              a partir de {formatCurrency(menorLanceImovel)}.
            </p>
          </div>
          <span className="text-sm font-medium text-accent group-hover:underline">Ver imóveis →</span>
        </Link>

        <Link
          href="/leiloes/veiculos"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-popover"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Car className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Veículos — Leilo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Carros, motos, utilitários e pesados. {DEMO_VEICULOS.length} lotes monitorados, com origem e
              quilometragem de cada um.
            </p>
          </div>
          <span className="text-sm font-medium text-accent group-hover:underline">Ver veículos →</span>
        </Link>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-3 flex items-center gap-2">
          <Gavel className="h-5 w-5 text-accent" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-foreground">Como funciona a calculadora</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Em cada lote, clique em <strong>Calcular rentabilidade</strong> pra abrir a calculadora já preenchida com
          o valor de lance e o valor de mercado/avaliação. Some os custos da operação (reforma, advogado para
          imissão na posse, documentação, reparo mecânico...) e veja o lucro líquido e o ROI em três cenários de
          revenda — pessimista, médio e otimista — com os percentuais de cada cenário ajustáveis por você.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Pra imóveis, tem também uma{" "}
          <Link href="/leiloes/imoveis/financiamento" className="font-medium text-accent hover:underline">
            calculadora de financiamento
          </Link>{" "}
          separada — com entrada, parcelas, juros, despesas mensais, imposto sobre ganho de capital e análise de
          múltiplos lances, também nos três cenários.
        </p>
      </section>
    </div>
  );
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
