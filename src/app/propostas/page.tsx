import { ProposalsBoard } from "@/components/proposals/ProposalsBoard";

export default function PropostasPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Propostas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Histórico completo das propostas enviadas, com status e desempenho.
        </p>
      </header>

      <ProposalsBoard />
    </div>
  );
}
