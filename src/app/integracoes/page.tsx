import { Plug } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function IntegracoesPage() {
  return (
    <ComingSoonPage
      icon={Plug}
      title="Integrações"
      description="Conecte suas contas nas plataformas de freelance e nos canais de notificação."
      bullets={[
        "Workana, Upwork, 99Freelas, Freelancer.com e LinkedIn",
        "Gmail, WhatsApp e Telegram para receber alertas",
        "Status de conexão em tempo real (conectado / não conectado)",
      ]}
    />
  );
}
