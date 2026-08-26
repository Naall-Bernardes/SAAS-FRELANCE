import { MatchIaForm } from "@/components/match-ia/MatchIaForm";

export default function MatchIaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Match IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ensine a IA o que é uma boa oportunidade para você.
        </p>
      </header>

      <MatchIaForm />
    </div>
  );
}
