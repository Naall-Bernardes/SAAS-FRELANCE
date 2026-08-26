import { FolderOpen } from "lucide-react";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export default function PortfolioPage() {
  return (
    <ComingSoonPage
      icon={FolderOpen}
      title="Portfólio"
      description="Projetos que a IA usa automaticamente ao gerar suas propostas."
      bullets={[
        "Nome, descrição, imagem, tecnologias e cliente",
        "Problema solucionado e resultado alcançado",
        "Usado automaticamente pelo gerador de propostas",
      ]}
    />
  );
}
