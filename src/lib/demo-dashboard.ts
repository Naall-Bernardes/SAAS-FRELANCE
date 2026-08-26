/**
 * Estatísticas de topo do dashboard (Início). São números "de headline" —
 * representam um volume maior do que os DEMO_OPPORTUNITIES individuais
 * (que servem só de amostra detalhada), do mesmo jeito que um dashboard
 * real mostra "127 hoje" no card sem listar as 127 uma a uma.
 */

export interface KpiCard {
  label: string;
  value: string;
  deltaLabel: string;
  deltaDirection: "up" | "down" | "neutral";
  tooltip: string;
}

export const DASHBOARD_KPIS: KpiCard[] = [
  {
    label: "Oportunidades hoje",
    value: "127",
    deltaLabel: "+12% em relação a ontem",
    deltaDirection: "up",
    tooltip: "Total de vagas novas encontradas pelas suas buscas nas últimas 24 horas.",
  },
  {
    label: "Novas oportunidades",
    value: "8",
    deltaLabel: "+3 na última hora",
    deltaDirection: "up",
    tooltip: "Vagas publicadas há menos de 1 hora que ainda não foram analisadas.",
  },
  {
    label: "Match acima de 80%",
    value: "23",
    deltaLabel: "+5 em relação a ontem",
    deltaDirection: "up",
    tooltip: "Oportunidades de hoje com Match IA ≥ 80% com o seu perfil.",
  },
  {
    label: "Oportunidades salvas",
    value: "14",
    deltaLabel: "sem alteração",
    deltaDirection: "neutral",
    tooltip: "Vagas que você marcou para avaliar com calma depois.",
  },
  {
    label: "Propostas enviadas",
    value: "5",
    deltaLabel: "+2 esta semana",
    deltaDirection: "up",
    tooltip: "Propostas geradas e marcadas como enviadas nos últimos 7 dias.",
  },
  {
    label: "Clientes que responderam",
    value: "2",
    deltaLabel: "40% de resposta",
    deltaDirection: "neutral",
    tooltip: "Das 5 propostas enviadas, quantas já tiveram retorno do cliente.",
  },
  {
    label: "Valor em oportunidades abertas",
    value: "R$ 18.500",
    deltaLabel: "+9% esta semana",
    deltaDirection: "up",
    tooltip: "Soma do valor de todas as oportunidades ainda não respondidas ou perdidas.",
  },
];

export interface DailyCount {
  label: string;
  count: number;
}

/** Oportunidades encontradas nos últimos 7 dias — o último ponto é "hoje" (127, bate com o KPI). */
export const LAST_7_DAYS: DailyCount[] = [
  { label: "Seg", count: 74 },
  { label: "Ter", count: 88 },
  { label: "Qua", count: 95 },
  { label: "Qui", count: 81 },
  { label: "Sex", count: 103 },
  { label: "Sáb", count: 113 },
  { label: "Dom", count: 127 },
];

export interface FunnelStage {
  label: string;
  count: number;
}

export const FUNNEL: FunnelStage[] = [
  { label: "Encontradas", count: 127 },
  { label: "Analisadas", count: 62 },
  { label: "Propostas", count: 5 },
  { label: "Respostas", count: 2 },
  { label: "Contratações", count: 1 },
];
