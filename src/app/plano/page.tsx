import { CreditCard } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function PlanoPage() {
  return (
    <ComingSoonPage
      icon={CreditCard}
      title="Plano"
      description="Seu plano atual, uso e opções de upgrade."
      bullets={[
        "Limites de buscas e alertas do plano atual",
        "Histórico de cobrança",
        "Upgrade ou downgrade de plano",
      ]}
    />
  );
}
