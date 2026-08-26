import { Sparkles } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function MatchIaPage() {
  return (
    <ComingSoonPage
      icon={Sparkles}
      title="Match IA"
      description="Ensine a IA o que é uma boa oportunidade para você."
      bullets={[
        "Suas habilidades e nível, interesses e palavras-chave negativas",
        "Valor mínimo, idiomas, disponibilidade e plataformas preferidas",
        "Estratégia de busca: mais oportunidades, equilibrado ou alta precisão",
      ]}
    />
  );
}
