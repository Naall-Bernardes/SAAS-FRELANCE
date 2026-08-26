import { TrendingUp } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function MercadoPage() {
  return (
    <ComingSoonPage
      icon={TrendingUp}
      title="Mercado"
      description="Inteligência de mercado sobre o ecossistema de freelance."
      bullets={[
        "Skills mais procuradas e valor médio por tecnologia",
        "Plataformas com mais oportunidades e categorias em crescimento",
        "Tendências identificadas pela IA, com recomendação prática",
      ]}
    />
  );
}
