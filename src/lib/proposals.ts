export type ProposalStatus = "enviada" | "visualizada" | "respondeu" | "negociacao" | "contratado" | "perdida";

export interface Proposal {
  id: string;
  project: string;
  client: string;
  platform: string;
  value: number;
  currency: string;
  sentAt: string; // ISO
  status: ProposalStatus;
  matchScore: number;
  respondedAt?: string; // ISO
  result: string;
}

export const STATUS_META: Record<ProposalStatus, { label: string; emoji: string; variant: "warning" | "accent" | "good" | "violet" | "critical" }> = {
  enviada: { label: "Enviada", emoji: "🟡", variant: "warning" },
  visualizada: { label: "Visualizada", emoji: "🔵", variant: "accent" },
  respondeu: { label: "Cliente respondeu", emoji: "🟢", variant: "good" },
  negociacao: { label: "Negociação", emoji: "🟣", variant: "violet" },
  contratado: { label: "Contratado", emoji: "✅", variant: "good" },
  perdida: { label: "Perdida", emoji: "🔴", variant: "critical" },
};

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60_000).toISOString();
}

export const SEED_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    project: "Consultor(a) SQL para otimização de queries",
    client: "Vector Systems",
    platform: "Freelancer.com",
    value: 1400,
    currency: "USD",
    sentAt: daysAgo(5),
    respondedAt: daysAgo(5 - 0.2),
    status: "negociacao",
    matchScore: 93,
    result: "Negociando prazo final",
  },
  {
    id: "prop-2",
    project: "Landing page responsiva com Tailwind CSS",
    client: "Studio Alma",
    platform: "Workana",
    value: 1200,
    currency: "BRL",
    sentAt: daysAgo(9),
    respondedAt: daysAgo(8.5),
    status: "contratado",
    matchScore: 77,
    result: "Contrato assinado",
  },
  {
    id: "prop-3",
    project: "WordPress developer for e-commerce customization",
    client: "BrightCart",
    platform: "Freelancer.com",
    value: 650,
    currency: "USD",
    sentAt: daysAgo(10),
    respondedAt: daysAgo(9),
    status: "perdida",
    matchScore: 62,
    result: "Cliente escolheu outro freelancer",
  },
  {
    id: "prop-4",
    project: "Automação de relatórios com Python",
    client: "Distribuidora Vale Verde",
    platform: "99Freelas",
    value: 2400,
    currency: "BRL",
    sentAt: daysAgo(6),
    respondedAt: daysAgo(5.7),
    status: "negociacao",
    matchScore: 89,
    result: "Aguardando aprovação do orçamento",
  },
  {
    id: "prop-5",
    project: "Full-stack engineer for MVP (React + Python)",
    client: "Northline Labs",
    platform: "Upwork",
    value: 4500,
    currency: "USD",
    sentAt: daysAgo(4),
    status: "visualizada",
    matchScore: 88,
    result: "—",
  },
  {
    id: "prop-6",
    project: "API REST em Node.js com autenticação JWT",
    client: "Loja Fácil",
    platform: "99Freelas",
    value: 2600,
    currency: "BRL",
    sentAt: daysAgo(3),
    status: "enviada",
    matchScore: 84,
    result: "—",
  },
  {
    id: "prop-7",
    project: "Dashboard financeiro em Power BI",
    client: "Grupo Andrade Contábil",
    platform: "Workana",
    value: 3000,
    currency: "BRL",
    sentAt: daysAgo(0.2),
    status: "enviada",
    matchScore: 96,
    result: "—",
  },
  {
    id: "prop-8",
    project: "Engenheiro(a) de dados para pipeline em nuvem",
    client: "Cronos Data",
    platform: "LinkedIn",
    value: 7000,
    currency: "BRL",
    sentAt: daysAgo(12),
    respondedAt: daysAgo(11),
    status: "perdida",
    matchScore: 79,
    result: "Orçamento acima do esperado pelo cliente",
  },
];
