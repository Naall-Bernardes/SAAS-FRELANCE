import { Users } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function ClientesPage() {
  return (
    <ComingSoonPage
      icon={Users}
      title="Clientes"
      description="Um mini-CRM com o histórico de cada cliente que já te contratou ou negociou."
      bullets={[
        "Plataforma, país, projetos e valor total negociado",
        "Histórico de oportunidades, propostas e mensagens por cliente",
        "Status do relacionamento e último contato",
      ]}
    />
  );
}
