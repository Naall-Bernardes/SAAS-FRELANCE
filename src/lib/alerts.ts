export type AlertFrequency = "instantaneo" | "hora" | "diario";
export type AlertChannel = "sistema" | "email" | "whatsapp" | "telegram";

export interface Alert {
  id: string;
  name: string;
  keywords: string[];
  platforms: string[];
  minValue?: number;
  minMatch?: number;
  maxCompetition?: "Baixa" | "Média" | "Alta" | "";
  category?: string;
  frequency: AlertFrequency;
  channels: AlertChannel[];
  active: boolean;
  foundCount: number;
  lastRunAt: string; // ISO
}

export const FREQUENCY_LABELS: Record<AlertFrequency, string> = {
  instantaneo: "Instantâneo",
  hora: "A cada hora",
  diario: "Diário",
};

export const CHANNEL_LABELS: Record<AlertChannel, string> = {
  sistema: "Sistema",
  email: "E-mail",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
};

export const SEED_ALERTS: Alert[] = [
  {
    id: "alert-1",
    name: "Power BI acima de R$ 1.000",
    keywords: ["Power BI", "Dashboard", "DAX", "Business Intelligence"],
    platforms: ["Workana", "99Freelas", "Freelancer.com"],
    minValue: 1000,
    minMatch: 75,
    maxCompetition: "",
    category: "Dados",
    frequency: "instantaneo",
    channels: ["sistema", "email"],
    active: true,
    foundCount: 12,
    lastRunAt: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
  {
    id: "alert-2",
    name: "Desenvolvimento React alta prioridade",
    keywords: ["React", "Next.js", "TypeScript"],
    platforms: ["Workana", "Upwork"],
    minValue: 2000,
    minMatch: 85,
    maxCompetition: "Média",
    category: "Desenvolvimento",
    frequency: "hora",
    channels: ["sistema", "whatsapp"],
    active: true,
    foundCount: 6,
    lastRunAt: new Date(Date.now() - 42 * 60_000).toISOString(),
  },
  {
    id: "alert-3",
    name: "Qualquer coisa em Automação",
    keywords: ["Automação", "Python", "VBA"],
    platforms: ["Workana", "99Freelas", "Freelancer.com", "Upwork", "LinkedIn"],
    minValue: undefined,
    minMatch: 60,
    maxCompetition: "",
    category: "",
    frequency: "diario",
    channels: ["email"],
    active: false,
    foundCount: 31,
    lastRunAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
  },
];
