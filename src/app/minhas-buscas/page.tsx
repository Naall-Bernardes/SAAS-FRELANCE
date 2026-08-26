import { SearchesBoard } from "@/components/searches/SearchesBoard";

export default function MinhasBuscasPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Minhas Buscas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          As buscas automatizadas que alimentam o Radar e as Oportunidades.
        </p>
      </header>

      <SearchesBoard />
    </div>
  );
}
