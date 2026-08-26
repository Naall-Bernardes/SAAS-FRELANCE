import { OpportunitiesBoard } from "@/components/opportunities/OpportunitiesBoard";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function OportunidadesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Oportunidades</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todas as vagas encontradas pelas suas buscas, com Match IA e prioridade sugerida.
        </p>
      </header>

      <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 text-sm text-warning">
        <strong>Dados de demonstração:</strong> Match IA, chance de contratação e concorrência são valores de
        exemplo — o motor de Match IA de verdade ainda não foi implementado (ver tela Match IA).
      </div>

      <OpportunitiesBoard initialQuery={q} />
    </div>
  );
}
