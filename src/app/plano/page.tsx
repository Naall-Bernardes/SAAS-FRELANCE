import { PlanBoard } from "@/components/plan/PlanBoard";

export default function PlanoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Plano</h1>
        <p className="mt-1 text-sm text-muted-foreground">Seu plano atual, uso e opções de upgrade.</p>
      </header>

      <PlanBoard />
    </div>
  );
}
