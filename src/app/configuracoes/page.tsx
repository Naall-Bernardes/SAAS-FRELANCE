import { Settings } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function ConfiguracoesPage() {
  return (
    <ComingSoonPage
      icon={Settings}
      title="Configurações"
      description="Preferências gerais da sua conta e do produto."
      bullets={[
        "Notificações e canais de alerta padrão",
        "Idioma, fuso horário e privacidade",
        "Gerenciamento geral da conta",
      ]}
    />
  );
}
