/**
 * Dataset de demonstração para as telas de Início, Oportunidades e Radar.
 *
 * Diferente de src/lib/mock-data.ts (usado só como fallback de banco em
 * Vagas/Análises), estes campos — matchScore, hireChance, competitionLevel,
 * priority, competitorsCount — não vêm de nenhum backend real: são o
 * resultado do futuro motor de "Match IA" (ver tela /match-ia), que ainda
 * não existe. Por isso essas três telas permanecem em modo demonstração
 * mesmo depois que o Supabase for conectado, até o motor de match ser
 * implementado de fato.
 */

export type CompetitionLevel = "Baixa" | "Média" | "Alta";
export type Priority = "Alta" | "Média" | "Baixa";

export interface DemoOpportunity {
  id: string;
  title: string;
  summary: string;
  platform: string;
  platformKey: string;
  client: string;
  category: string;
  value: number;
  currency: string;
  publishedAt: Date;
  skills: string[];
  competitorsCount: number;
  competitionLevel: CompetitionLevel;
  matchScore: number;
  hireChance: number;
  priority: Priority;
  url: string;
}

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60_000);
}

export const PLATFORMS = ["Workana", "99Freelas", "Upwork", "Freelancer.com", "LinkedIn"] as const;
export const CATEGORIES = [
  "Desenvolvimento",
  "Dados",
  "Engenharia",
  "Design",
  "Marketing",
  "Consultoria",
  "Administração",
] as const;

export const DEMO_OPPORTUNITIES: DemoOpportunity[] = [
  {
    id: "op-1",
    title: "Dashboard financeiro em Power BI",
    summary: "Construção de dashboard financeiro completo com DAX, conexão a ERP e atualização automática.",
    platform: "Workana",
    platformKey: "workana",
    client: "Grupo Andrade Contábil",
    category: "Dados",
    value: 3000,
    currency: "BRL",
    publishedAt: minutesAgo(8),
    skills: ["Power BI", "DAX", "Excel", "SQL"],
    competitorsCount: 3,
    competitionLevel: "Baixa",
    matchScore: 96,
    hireChance: 84,
    priority: "Alta",
    url: "#",
  },
  {
    id: "op-2",
    title: "Desenvolvedor(a) React/Next.js para dashboard SaaS",
    summary: "Telas de um painel administrativo em Next.js + Tailwind, com integração de APIs REST.",
    platform: "Workana",
    platformKey: "workana",
    client: "Nimbus Tech",
    category: "Desenvolvimento",
    value: 3200,
    currency: "BRL",
    publishedAt: minutesAgo(22),
    skills: ["React", "Next.js", "TypeScript", "Tailwind"],
    competitorsCount: 9,
    competitionLevel: "Média",
    matchScore: 91,
    hireChance: 78,
    priority: "Alta",
    url: "#",
  },
  {
    id: "op-3",
    title: "Automação de relatórios com Python",
    summary: "Script para consolidar planilhas semanais e gerar relatório em PDF automaticamente.",
    platform: "99Freelas",
    platformKey: "99freelas",
    client: "Distribuidora Vale Verde",
    category: "Dados",
    value: 2400,
    currency: "BRL",
    publishedAt: minutesAgo(45),
    skills: ["Python", "Pandas", "Automação"],
    competitorsCount: 4,
    competitionLevel: "Baixa",
    matchScore: 89,
    hireChance: 71,
    priority: "Alta",
    url: "#",
  },
  {
    id: "op-4",
    title: "API REST em Node.js com autenticação JWT",
    summary: "API com autenticação JWT, integração com PostgreSQL e documentação Swagger.",
    platform: "99Freelas",
    platformKey: "99freelas",
    client: "Loja Fácil",
    category: "Desenvolvimento",
    value: 2600,
    currency: "BRL",
    publishedAt: minutesAgo(110),
    skills: ["Node.js", "Express", "JWT", "PostgreSQL"],
    competitorsCount: 11,
    competitionLevel: "Média",
    matchScore: 84,
    hireChance: 66,
    priority: "Média",
    url: "#",
  },
  {
    id: "op-5",
    title: "Consultoria em BI para varejo",
    summary: "Diagnóstico e plano de implantação de Business Intelligence para rede varejista.",
    platform: "LinkedIn",
    platformKey: "linkedin",
    client: "Rede Bomdia",
    category: "Consultoria",
    value: 5000,
    currency: "BRL",
    publishedAt: minutesAgo(180),
    skills: ["Power BI", "Consultoria", "Varejo"],
    competitorsCount: 2,
    competitionLevel: "Baixa",
    matchScore: 82,
    hireChance: 60,
    priority: "Alta",
    url: "#",
  },
  {
    id: "op-6",
    title: "Landing page responsiva com Tailwind CSS",
    summary: "Landing page moderna para lançamento de produto, foco em conversão e performance.",
    platform: "Workana",
    platformKey: "workana",
    client: "Studio Alma",
    category: "Design",
    value: 1200,
    currency: "BRL",
    publishedAt: minutesAgo(300),
    skills: ["HTML", "Tailwind CSS", "Figma"],
    competitorsCount: 21,
    competitionLevel: "Alta",
    matchScore: 77,
    hireChance: 55,
    priority: "Média",
    url: "#",
  },
  {
    id: "op-7",
    title: "Full-stack engineer for MVP (React + Python)",
    summary: "We're building an MVP and need someone comfortable across React and FastAPI.",
    platform: "Upwork",
    platformKey: "upwork",
    client: "Northline Labs",
    category: "Desenvolvimento",
    value: 4500,
    currency: "USD",
    publishedAt: minutesAgo(360),
    skills: ["React", "Python", "FastAPI"],
    competitorsCount: 14,
    competitionLevel: "Média",
    matchScore: 88,
    hireChance: 68,
    priority: "Alta",
    url: "#",
  },
  {
    id: "op-8",
    title: "WordPress developer for e-commerce customization",
    summary: "Customize a WooCommerce theme and fix checkout issues on an existing store.",
    platform: "Freelancer.com",
    platformKey: "freelancer",
    client: "BrightCart",
    category: "Desenvolvimento",
    value: 650,
    currency: "USD",
    publishedAt: minutesAgo(540),
    skills: ["WordPress", "WooCommerce", "PHP"],
    competitorsCount: 27,
    competitionLevel: "Alta",
    matchScore: 62,
    hireChance: 38,
    priority: "Baixa",
    url: "#",
  },
  {
    id: "op-9",
    title: "Engenheiro(a) de dados para pipeline em nuvem",
    summary: "Construção de pipeline de ingestão de dados com Airflow rodando na AWS.",
    platform: "LinkedIn",
    platformKey: "linkedin",
    client: "Cronos Data",
    category: "Engenharia",
    value: 7000,
    currency: "BRL",
    publishedAt: minutesAgo(720),
    skills: ["AWS", "Airflow", "Python", "SQL"],
    competitorsCount: 8,
    competitionLevel: "Média",
    matchScore: 79,
    hireChance: 58,
    priority: "Média",
    url: "#",
  },
  {
    id: "op-10",
    title: "Gestão de tráfego pago para e-commerce",
    summary: "Planejamento e otimização de campanhas no Google Ads e Meta Ads.",
    platform: "Workana",
    platformKey: "workana",
    client: "Bella Moda",
    category: "Marketing",
    value: 1800,
    currency: "BRL",
    publishedAt: minutesAgo(1200),
    skills: ["Google Ads", "Meta Ads", "Analytics"],
    competitorsCount: 19,
    competitionLevel: "Alta",
    matchScore: 68,
    hireChance: 45,
    priority: "Baixa",
    url: "#",
  },
  {
    id: "op-11",
    title: "Assistente administrativo(a) para rotina financeira",
    summary: "Apoio em conciliação bancária, emissão de boletos e organização de planilhas.",
    platform: "99Freelas",
    platformKey: "99freelas",
    client: "Escritório Lumen",
    category: "Administração",
    value: 900,
    currency: "BRL",
    publishedAt: minutesAgo(1440),
    skills: ["Excel", "Financeiro", "Organização"],
    competitorsCount: 33,
    competitionLevel: "Alta",
    matchScore: 55,
    hireChance: 30,
    priority: "Baixa",
    url: "#",
  },
  {
    id: "op-12",
    title: "Automação de planilhas com Excel avançado",
    summary: "Criação de planilha com macros em VBA para consolidar vendas de múltiplas lojas.",
    platform: "Workana",
    platformKey: "workana",
    client: "Comercial Ipê",
    category: "Dados",
    value: 1500,
    currency: "BRL",
    publishedAt: minutesAgo(1680),
    skills: ["Excel", "VBA", "Automação"],
    competitorsCount: 5,
    competitionLevel: "Baixa",
    matchScore: 85,
    hireChance: 63,
    priority: "Média",
    url: "#",
  },
  {
    id: "op-13",
    title: "Design de identidade visual para startup",
    summary: "Logotipo, paleta de cores e guia de marca para startup em fase de lançamento.",
    platform: "99Freelas",
    platformKey: "99freelas",
    client: "Orbita Ventures",
    category: "Design",
    value: 2200,
    currency: "BRL",
    publishedAt: minutesAgo(2880),
    skills: ["Branding", "Figma", "Ilustração"],
    competitorsCount: 16,
    competitionLevel: "Média",
    matchScore: 71,
    hireChance: 48,
    priority: "Média",
    url: "#",
  },
  {
    id: "op-14",
    title: "Consultor(a) SQL para otimização de queries",
    summary: "Diagnóstico de performance e reescrita de queries lentas em banco PostgreSQL.",
    platform: "Freelancer.com",
    platformKey: "freelancer",
    client: "Vector Systems",
    category: "Dados",
    value: 1400,
    currency: "USD",
    publishedAt: minutesAgo(4200),
    skills: ["SQL", "PostgreSQL", "Performance Tuning"],
    competitorsCount: 3,
    competitionLevel: "Baixa",
    matchScore: 93,
    hireChance: 80,
    priority: "Alta",
    url: "#",
  },
];

export function isHot(op: DemoOpportunity, now: Date = new Date()): boolean {
  const minutesSince = (now.getTime() - op.publishedAt.getTime()) / 60_000;
  return op.matchScore >= 90 && minutesSince <= 60;
}

export interface QualityBadge {
  label: string;
  emoji: string;
  variant: "hot" | "good" | "warning" | "critical";
}

export function getQualityBadge(op: DemoOpportunity, now: Date = new Date()): QualityBadge {
  if (isHot(op, now)) return { label: "HOT", emoji: "🔥", variant: "hot" };
  if (op.matchScore >= 85) return { label: "Excelente", emoji: "🟢", variant: "good" };
  if (op.matchScore >= 70) return { label: "Boa", emoji: "🟡", variant: "warning" };
  return { label: "Baixa prioridade", emoji: "🔴", variant: "critical" };
}
