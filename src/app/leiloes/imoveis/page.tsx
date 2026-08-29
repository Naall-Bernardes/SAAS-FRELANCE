import Link from "next/link";
import { Landmark } from "lucide-react";
import { ImoveisBoard } from "@/components/auctions/ImoveisBoard";

export default function LeiloesImoveisPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leilões de Imóveis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Casas, apartamentos, terrenos e salas comerciais. Clique em um lote para calcular a rentabilidade.
          </p>
        </div>
        <Link
          href="/leiloes/imoveis/financiamento"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Landmark className="h-4 w-4" strokeWidth={2} />
          Calculadora de financiamento
        </Link>
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> a busca ao vivo no site da Caixa ainda não está ligada — o
        conector em <code>src/lib/auction-connectors/caixa.ts</code> documenta o motivo (é um wizard de 4 passos,
        sem URL de resultado estável) e o que falta pra ativar.
      </div>

      <ImoveisBoard />
    </div>
  );
}
