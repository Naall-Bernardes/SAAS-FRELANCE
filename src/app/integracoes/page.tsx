import { IntegrationsBoard } from "@/components/integrations/IntegrationsBoard";

export default function IntegracoesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Integrações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte suas contas nas plataformas de freelance e nos canais de notificação.
        </p>
      </header>

      <IntegrationsBoard />
    </div>
  );
}
