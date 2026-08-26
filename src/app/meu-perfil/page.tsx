import { UserCircle2 } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function MeuPerfilPage() {
  return (
    <ComingSoonPage
      icon={UserCircle2}
      title="Meu Perfil"
      description="Seu perfil profissional completo — a base que a IA usa pra calcular o Match."
      bullets={[
        "Bio, experiência, formação, certificações, skills e idiomas",
        "Indicador de força do perfil e recomendações de melhoria",
        "Valor/hora, disponibilidade e país",
      ]}
    />
  );
}
