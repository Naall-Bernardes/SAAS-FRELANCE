export type ClientStatus = "ativo" | "inativo" | "prospecto";

export interface ClientHistoryItem {
  type: "oportunidade" | "proposta" | "mensagem" | "projeto" | "contratacao";
  label: string;
  daysAgo: number;
}

export interface Client {
  id: string;
  name: string;
  platform: string;
  country: string;
  projectsCount: number;
  totalValue: number;
  status: ClientStatus;
  lastContactAt: string; // ISO
  history: ClientHistoryItem[];
}

export const STATUS_LABEL: Record<ClientStatus, string> = {
  ativo: "🟢 Ativo",
  inativo: "⚪ Inativo",
  prospecto: "🟡 Prospecto",
};

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60_000).toISOString();
}

export const SEED_CLIENTS: Client[] = [
  {
    id: "cl-1",
    name: "Grupo Andrade Contábil",
    platform: "Workana",
    country: "Brasil",
    projectsCount: 1,
    totalValue: 3000,
    status: "prospecto",
    lastContactAt: daysAgo(0.1),
    history: [
      { type: "oportunidade", label: "Dashboard financeiro em Power BI publicada", daysAgo: 0.1 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 0.08 },
    ],
  },
  {
    id: "cl-2",
    name: "Studio Alma",
    platform: "Workana",
    country: "Brasil",
    projectsCount: 1,
    totalValue: 1200,
    status: "ativo",
    lastContactAt: daysAgo(8),
    history: [
      { type: "oportunidade", label: "Landing page responsiva publicada", daysAgo: 9 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 9 },
      { type: "mensagem", label: "Cliente pediu ajuste no prazo", daysAgo: 8.7 },
      { type: "contratacao", label: "Contrato fechado", daysAgo: 8.5 },
      { type: "projeto", label: "Projeto em andamento", daysAgo: 8 },
    ],
  },
  {
    id: "cl-3",
    name: "BrightCart",
    platform: "Freelancer.com",
    country: "Estados Unidos",
    projectsCount: 0,
    totalValue: 0,
    status: "inativo",
    lastContactAt: daysAgo(9),
    history: [
      { type: "oportunidade", label: "WordPress customization publicada", daysAgo: 10 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 10 },
      { type: "mensagem", label: "Cliente escolheu outro freelancer", daysAgo: 9 },
    ],
  },
  {
    id: "cl-4",
    name: "Distribuidora Vale Verde",
    platform: "99Freelas",
    country: "Brasil",
    projectsCount: 1,
    totalValue: 2400,
    status: "ativo",
    lastContactAt: daysAgo(5.7),
    history: [
      { type: "oportunidade", label: "Automação de relatórios publicada", daysAgo: 6 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 6 },
      { type: "mensagem", label: "Negociando prazo de entrega", daysAgo: 5.7 },
    ],
  },
  {
    id: "cl-5",
    name: "Northline Labs",
    platform: "Upwork",
    country: "Estados Unidos",
    projectsCount: 0,
    totalValue: 0,
    status: "prospecto",
    lastContactAt: daysAgo(4),
    history: [
      { type: "oportunidade", label: "Full-stack MVP publicada", daysAgo: 4 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 4 },
    ],
  },
  {
    id: "cl-6",
    name: "Vector Systems",
    platform: "Freelancer.com",
    country: "Canadá",
    projectsCount: 1,
    totalValue: 1400,
    status: "ativo",
    lastContactAt: daysAgo(5),
    history: [
      { type: "oportunidade", label: "Consultoria SQL publicada", daysAgo: 5 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 5 },
      { type: "mensagem", label: "Cliente respondeu com interesse", daysAgo: 5 },
      { type: "projeto", label: "Negociação em andamento", daysAgo: 4.5 },
    ],
  },
  {
    id: "cl-7",
    name: "Cronos Data",
    platform: "LinkedIn",
    country: "Brasil",
    projectsCount: 0,
    totalValue: 0,
    status: "inativo",
    lastContactAt: daysAgo(11),
    history: [
      { type: "oportunidade", label: "Pipeline de dados na AWS publicada", daysAgo: 12 },
      { type: "proposta", label: "Proposta enviada", daysAgo: 12 },
      { type: "mensagem", label: "Orçamento acima do esperado pelo cliente", daysAgo: 11 },
    ],
  },
  {
    id: "cl-8",
    name: "Rede Bomdia",
    platform: "LinkedIn",
    country: "Brasil",
    projectsCount: 0,
    totalValue: 0,
    status: "prospecto",
    lastContactAt: daysAgo(3),
    history: [{ type: "oportunidade", label: "Consultoria em BI para varejo publicada", daysAgo: 3 }],
  },
];
