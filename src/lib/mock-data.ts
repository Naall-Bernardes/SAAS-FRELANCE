/**
 * Dados de exemplo usados enquanto não há um banco de dados configurado
 * (DATABASE_URL ausente/vazio) — permite trabalhar no front sem depender
 * do backend/Supabase. Ver src/lib/data.ts.
 */

// Campos opcionais como `number | null | undefined` para casar tanto com os
// dados de exemplo (undefined quando ausente) quanto com o retorno do
// Prisma (null quando ausente).
export interface MockOpportunity {
  id: string;
  title: string;
  description: string;
  url: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  currency?: string | null;
  category?: string | null;
  postedAt: Date | null;
  source: { key: string; name: string };
}

export const mockSources = [
  { key: "workana", name: "Workana" },
  { key: "99freelas", name: "99Freelas" },
  { key: "freelancer", name: "Freelancer.com" },
  { key: "upwork", name: "Upwork" },
];

export const mockOpportunities: MockOpportunity[] = [
  {
    id: "mock-1",
    title: "Desenvolvedor(a) React/Next.js para dashboard SaaS",
    description:
      "Precisamos de um dev front-end para construir telas de um painel administrativo em Next.js + Tailwind. Experiência com integração de APIs REST é um diferencial.",
    url: "#",
    budgetMin: 2500,
    budgetMax: 4000,
    currency: "BRL",
    category: "Desenvolvimento Web",
    postedAt: new Date("2026-08-24T10:00:00Z"),
    source: { key: "workana", name: "Workana" },
  },
  {
    id: "mock-2",
    title: "API REST em Node.js com autenticação JWT",
    description:
      "Buscamos freelancer para desenvolver uma API REST em Node.js/Express com autenticação JWT, integração com PostgreSQL e documentação Swagger.",
    url: "#",
    budgetMin: 1800,
    budgetMax: 3000,
    currency: "BRL",
    category: "Backend",
    postedAt: new Date("2026-08-23T14:30:00Z"),
    source: { key: "99freelas", name: "99Freelas" },
  },
  {
    id: "mock-3",
    title: "WordPress developer for e-commerce customization",
    description:
      "Looking for an experienced WordPress/WooCommerce developer to customize a theme and fix checkout issues.",
    url: "#",
    budgetMin: 500,
    budgetMax: 800,
    currency: "USD",
    category: "E-commerce",
    postedAt: new Date("2026-08-22T09:15:00Z"),
    source: { key: "freelancer", name: "Freelancer.com" },
  },
  {
    id: "mock-4",
    title: "Full-stack engineer for MVP (React + Python)",
    description:
      "We're building an MVP and need a full-stack engineer comfortable with React on the front-end and Python/FastAPI on the back-end.",
    url: "#",
    budgetMin: 3000,
    budgetMax: 6000,
    currency: "USD",
    category: "Desenvolvimento Web",
    postedAt: new Date("2026-08-21T18:00:00Z"),
    source: { key: "upwork", name: "Upwork" },
  },
  {
    id: "mock-5",
    title: "Landing page responsiva com Tailwind CSS",
    description:
      "Preciso de uma landing page moderna e responsiva para lançamento de produto, com foco em conversão e performance (Lighthouse 90+).",
    url: "#",
    budgetMin: 800,
    budgetMax: 1500,
    currency: "BRL",
    category: "Design & Front-end",
    postedAt: new Date("2026-08-20T11:45:00Z"),
    source: { key: "workana", name: "Workana" },
  },
];
