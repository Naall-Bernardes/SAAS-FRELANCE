import { PortfolioBoard } from "@/components/portfolio/PortfolioBoard";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Portfólio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Projetos que a IA usa automaticamente ao gerar suas propostas.
        </p>
      </header>

      <PortfolioBoard />
    </div>
  );
}
