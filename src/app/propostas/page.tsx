import { FileText } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function PropostasPage() {
  return (
    <ComingSoonPage
      icon={FileText}
      title="Propostas"
      description="Histórico completo das propostas enviadas, com status e desempenho."
      bullets={[
        "Status: enviada, visualizada, respondida, negociação, contratado, perdida",
        "Taxa de resposta, taxa de contratação e ticket médio",
        "Tempo médio até a resposta do cliente",
      ]}
    />
  );
}
