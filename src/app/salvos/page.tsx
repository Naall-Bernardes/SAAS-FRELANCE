import { Bookmark } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function SalvosPage() {
  return (
    <ComingSoonPage
      icon={Bookmark}
      title="Salvos"
      description="Oportunidades favoritadas, organizadas do seu jeito."
      bullets={[
        "Criar coleções personalizadas (Alta prioridade, Power BI, Automação...)",
        "Mover oportunidades entre pastas",
        "Filtrar por plataforma, Match, valor, data e categoria",
      ]}
    />
  );
}
