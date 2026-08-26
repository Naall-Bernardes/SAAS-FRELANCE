import { Bell } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function AlertasPage() {
  return (
    <ComingSoonPage
      icon={Bell}
      title="Alertas"
      description="Alertas personalizados que avisam quando surgir a oportunidade certa."
      bullets={[
        "Nome, palavras-chave, plataformas, valor e Match mínimo",
        "Frequência: instantâneo, a cada hora ou diário",
        "Envio por sistema, e-mail, WhatsApp ou Telegram",
      ]}
    />
  );
}
