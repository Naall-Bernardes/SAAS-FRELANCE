import { KanbanSquare } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function PipelinePage() {
  return (
    <ComingSoonPage
      icon={KanbanSquare}
      title="Pipeline"
      description="CRM visual em Kanban, da oportunidade encontrada até o contrato fechado."
      bullets={[
        "Encontrada → Analisada → Proposta enviada → Respondeu → Negociação → Contratado → Perdida",
        "Arrastar e soltar entre etapas",
        "Valor total em pipeline, taxa de conversão e propostas aguardando resposta",
      ]}
    />
  );
}
