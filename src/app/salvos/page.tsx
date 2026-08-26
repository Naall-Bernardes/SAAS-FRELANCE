import { SavedBoard } from "@/components/saved/SavedBoard";

export default function SalvosPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Salvos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oportunidades favoritadas, organizadas em coleções. Fica salvo no seu navegador.
        </p>
      </header>

      <SavedBoard />
    </div>
  );
}
