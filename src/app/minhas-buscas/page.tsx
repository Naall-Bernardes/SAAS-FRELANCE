import { Search } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function MinhasBuscasPage() {
  return (
    <ComingSoonPage
      icon={Search}
      title="Minhas Buscas"
      description="As buscas automatizadas que alimentam o Radar e as Oportunidades."
      bullets={[
        "Palavras-chave e plataformas pesquisadas por busca",
        "Quantidade encontrada hoje e com Match acima de 80%",
        "Editar, executar agora, pausar ou excluir",
      ]}
    />
  );
}
