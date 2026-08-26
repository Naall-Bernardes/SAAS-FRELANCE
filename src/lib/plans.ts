export interface PlanTier {
  key: string;
  name: string;
  price: string;
  cadence: string;
  features: string[];
  searchLimit: number;
  alertLimit: number;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    key: "free",
    name: "Free",
    price: "R$ 0",
    cadence: "/mês",
    features: ["3 buscas ativas", "1 alerta", "Radar básico"],
    searchLimit: 3,
    alertLimit: 1,
  },
  {
    key: "pro",
    name: "Pro",
    price: "R$ 49",
    cadence: "/mês",
    features: ["Buscas ilimitadas", "10 alertas", "Match IA completo", "Gerador de propostas"],
    searchLimit: 999,
    alertLimit: 10,
  },
  {
    key: "business",
    name: "Business",
    price: "R$ 149",
    cadence: "/mês",
    features: ["Tudo do Pro", "Pipeline e CRM completo", "Múltiplos perfis", "Suporte prioritário"],
    searchLimit: 999,
    alertLimit: 999,
  },
];

export interface BillingEntry {
  date: string;
  description: string;
  amount: number;
  status: "Pago" | "Pendente";
}

export const BILLING_HISTORY: BillingEntry[] = [
  { date: "01/08/2026", description: "Plano Pro — mensalidade", amount: 49, status: "Pago" },
  { date: "01/07/2026", description: "Plano Pro — mensalidade", amount: 49, status: "Pago" },
  { date: "01/06/2026", description: "Plano Pro — mensalidade", amount: 49, status: "Pago" },
];
