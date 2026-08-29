import { VeiculosBoard } from "@/components/auctions/VeiculosBoard";

export default function LeiloesVeiculosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Leilões de Veículos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Carros, motos, utilitários e pesados. Clique em um lote para calcular a rentabilidade.
        </p>
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> a busca ao vivo no Leilo ainda não está ligada — o site carrega os
        lotes via API própria protegida por token (ver <code>src/lib/auction-connectors/leilo.ts</code>), então por
        ora esta tela usa dados de exemplo com o mesmo formato dos lotes reais.
      </div>

      <VeiculosBoard />
    </div>
  );
}
