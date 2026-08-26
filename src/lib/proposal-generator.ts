export type ProposalStyle = "profissional" | "direto" | "consultivo" | "tecnico" | "persuasivo" | "curto";

export const PROPOSAL_STYLES: { value: ProposalStyle; label: string; description: string }[] = [
  { value: "profissional", label: "Profissional", description: "Tom formal e cordial, para o primeiro contato." },
  { value: "direto", label: "Direto", description: "Vai direto ao ponto, sem rodeios." },
  { value: "consultivo", label: "Consultivo", description: "Foca em entender e resolver o problema do cliente." },
  { value: "tecnico", label: "Técnico", description: "Detalha a abordagem e as tecnologias usadas." },
  { value: "persuasivo", label: "Persuasivo", description: "Enfatiza benefícios e resultados esperados." },
  { value: "curto", label: "Curto", description: "Resumido, direto pros pontos essenciais." },
];

export interface ProposalDraft {
  clientName: string;
  projectTitle: string;
  platform: string;
  scope: string;
  deliverables: string; // um item por linha
  value: number;
  currency: string;
  deadline: string;
  freelancerName: string;
  freelancerTitle: string;
  style: ProposalStyle;
  body: string;
}

export const EMPTY_PROPOSAL_DRAFT: ProposalDraft = {
  clientName: "",
  projectTitle: "",
  platform: "Workana",
  scope: "",
  deliverables: "",
  value: 0,
  currency: "BRL",
  deadline: "",
  freelancerName: "",
  freelancerTitle: "",
  style: "profissional",
  body: "",
};

const OPENERS: Record<ProposalStyle, (d: ProposalDraft) => string> = {
  profissional: (d) =>
    `Olá${d.clientName ? `, ${d.clientName}` : ""}! Agradeço a oportunidade de apresentar esta proposta para o projeto "${d.projectTitle || "seu projeto"}". Após analisar os requisitos, preparei um plano de trabalho que atende exatamente ao que você precisa.`,
  direto: (d) =>
    `Olá${d.clientName ? `, ${d.clientName}` : ""}. Segue minha proposta para "${d.projectTitle || "o projeto"}":`,
  consultivo: (d) =>
    `Olá${d.clientName ? `, ${d.clientName}` : ""}! Entendi que você precisa de ajuda com "${d.projectTitle || "este projeto"}". Abaixo explico como eu abordaria o problema e qual resultado você pode esperar.`,
  tecnico: (d) =>
    `Olá${d.clientName ? `, ${d.clientName}` : ""}. Segue o detalhamento técnico da abordagem que utilizarei no projeto "${d.projectTitle || "proposto"}".`,
  persuasivo: (d) =>
    `Olá${d.clientName ? `, ${d.clientName}` : ""}! "${d.projectTitle || "Este projeto"}" tem tudo pra sair exatamente como você imagina — e eu tenho a experiência certa pra entregar isso com qualidade e no prazo.`,
  curto: (d) => `Olá${d.clientName ? `, ${d.clientName}` : ""}. Proposta para "${d.projectTitle || "o projeto"}":`,
};

const CLOSERS: Record<ProposalStyle, () => string> = {
  profissional: () =>
    "Fico à disposição para esclarecer qualquer dúvida e ajustar os detalhes conforme sua necessidade. Aguardo seu retorno!",
  direto: () => "Qualquer dúvida, me chama. Podemos começar assim que fechar.",
  consultivo: () => "Se fizer sentido pra você, podemos conversar mais sobre os detalhes antes de começar.",
  tecnico: () => "Posso detalhar qualquer parte da arquitetura ou stack proposta, se for útil.",
  persuasivo: () => "Vamos tirar esse projeto do papel? Estou pronto pra começar assim que você confirmar.",
  curto: () => "Qualquer coisa, é só chamar.",
};

function formatDeliverables(deliverables: string): string {
  const items = deliverables
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (items.length === 0) return "";
  return `\n\nO que está incluído:\n${items.map((item) => `• ${item}`).join("\n")}`;
}

/** Monta um texto inicial de proposta a partir dos dados do formulário — ponto de partida editável, não texto final. */
export function buildProposalTemplate(draft: ProposalDraft): string {
  const opener = OPENERS[draft.style](draft);
  const scopeParagraph = draft.scope.trim() ? `\n\n${draft.scope.trim()}` : "";
  const deliverablesBlock = formatDeliverables(draft.deliverables);
  const closer = CLOSERS[draft.style]();

  return `${opener}${scopeParagraph}${deliverablesBlock}\n\n${closer}`;
}
