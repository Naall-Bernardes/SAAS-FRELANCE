import { ProposalGeneratorForm } from "@/components/proposal-generator/ProposalGeneratorForm";

interface PageProps {
  searchParams: Promise<{ opportunidade?: string }>;
}

export default async function GeradorPropostasPage({ searchParams }: PageProps) {
  const { opportunidade } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Gerador de Propostas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha os dados, ajuste o texto e baixe a proposta já formatada em PDF.
        </p>
      </header>

      <ProposalGeneratorForm initialOpportunityId={opportunidade} />
    </div>
  );
}
