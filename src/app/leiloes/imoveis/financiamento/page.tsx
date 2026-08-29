import { FinancingCalculator } from "@/components/auctions/FinancingCalculator";
import { DEMO_IMOVEIS } from "@/lib/demo-auctions";

interface PageProps {
  searchParams: Promise<{ imovelId?: string }>;
}

export default async function CalculadoraFinanciamentoPage({ searchParams }: PageProps) {
  const { imovelId } = await searchParams;
  const imovel = imovelId ? DEMO_IMOVEIS.find((im) => im.id === imovelId) : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Calculadora de Financiamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simule a compra de um imóvel de leilão com entrada, parcelas e juros — ou à vista — e veja o lucro
          líquido e o ROI em três cenários de revenda: pessimista, médio e otimista.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <FinancingCalculator
          initial={
            imovel
              ? {
                  title: imovel.title,
                  marketValue: imovel.evaluationValue,
                  auctionBidValue: imovel.firstBidValue,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
