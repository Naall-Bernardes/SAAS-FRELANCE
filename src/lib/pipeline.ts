export const PIPELINE_STAGES = [
  "Encontrada",
  "Analisada",
  "Proposta enviada",
  "Cliente respondeu",
  "Negociação",
  "Contratado",
  "Perdida",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export interface PipelineCard {
  id: string;
  title: string;
  client: string;
  platform: string;
  value: number;
  currency: string;
  matchScore: number;
  createdAt: string; // ISO
  nextAction: string;
  stage: PipelineStage;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60_000).toISOString();
}

export const SEED_PIPELINE: PipelineCard[] = [
  {
    id: "pl-1",
    title: "Dashboard financeiro em Power BI",
    client: "Grupo Andrade Contábil",
    platform: "Workana",
    value: 3000,
    currency: "BRL",
    matchScore: 96,
    createdAt: daysAgo(0),
    nextAction: "Analisar escopo completo",
    stage: "Encontrada",
  },
  {
    id: "pl-2",
    title: "Consultoria em BI para varejo",
    client: "Rede Bomdia",
    platform: "LinkedIn",
    value: 5000,
    currency: "BRL",
    matchScore: 82,
    createdAt: daysAgo(1),
    nextAction: "Confirmar escopo com o cliente",
    stage: "Encontrada",
  },
  {
    id: "pl-3",
    title: "Automação de planilhas com Excel avançado",
    client: "Comercial Ipê",
    platform: "Workana",
    value: 1500,
    currency: "BRL",
    matchScore: 85,
    createdAt: daysAgo(1),
    nextAction: "Definir se vale a pena propor",
    stage: "Analisada",
  },
  {
    id: "pl-4",
    title: "Engenheiro(a) de dados para pipeline em nuvem",
    client: "Cronos Data",
    platform: "LinkedIn",
    value: 7000,
    currency: "BRL",
    matchScore: 79,
    createdAt: daysAgo(2),
    nextAction: "Avaliar disponibilidade de agenda",
    stage: "Analisada",
  },
  {
    id: "pl-5",
    title: "API REST em Node.js com autenticação JWT",
    client: "Loja Fácil",
    platform: "99Freelas",
    value: 2600,
    currency: "BRL",
    matchScore: 84,
    createdAt: daysAgo(3),
    nextAction: "Aguardar retorno do cliente",
    stage: "Proposta enviada",
  },
  {
    id: "pl-6",
    title: "Full-stack engineer for MVP (React + Python)",
    client: "Northline Labs",
    platform: "Upwork",
    value: 4500,
    currency: "USD",
    matchScore: 88,
    createdAt: daysAgo(4),
    nextAction: "Follow-up amanhã",
    stage: "Proposta enviada",
  },
  {
    id: "pl-7",
    title: "Consultor(a) SQL para otimização de queries",
    client: "Vector Systems",
    platform: "Freelancer.com",
    value: 1400,
    currency: "USD",
    matchScore: 93,
    createdAt: daysAgo(5),
    nextAction: "Responder dúvidas sobre prazo",
    stage: "Cliente respondeu",
  },
  {
    id: "pl-8",
    title: "Automação de relatórios com Python",
    client: "Distribuidora Vale Verde",
    platform: "99Freelas",
    value: 2400,
    currency: "BRL",
    matchScore: 89,
    createdAt: daysAgo(6),
    nextAction: "Negociar prazo de entrega",
    stage: "Negociação",
  },
  {
    id: "pl-9",
    title: "Landing page responsiva com Tailwind CSS",
    client: "Studio Alma",
    platform: "Workana",
    value: 1200,
    currency: "BRL",
    matchScore: 77,
    createdAt: daysAgo(9),
    nextAction: "Kickoff agendado",
    stage: "Contratado",
  },
  {
    id: "pl-10",
    title: "WordPress developer for e-commerce customization",
    client: "BrightCart",
    platform: "Freelancer.com",
    value: 650,
    currency: "USD",
    matchScore: 62,
    createdAt: daysAgo(10),
    nextAction: "Cliente escolheu outro freelancer",
    stage: "Perdida",
  },
];
