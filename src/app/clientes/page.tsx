import { ClientsBoard } from "@/components/clients/ClientsBoard";

export default function ClientesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-xl font-bold text-foreground">Clientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Clique em um cliente pra ver o histórico de oportunidades, propostas, mensagens e projetos.
        </p>
      </header>

      <ClientsBoard />
    </div>
  );
}
