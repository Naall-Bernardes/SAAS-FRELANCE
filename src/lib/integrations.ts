export interface IntegrationDef {
  key: string;
  name: string;
  description: string;
  group: "Plataformas de freelance" | "Notificações";
}

export const INTEGRATIONS: IntegrationDef[] = [
  { key: "workana", name: "Workana", description: "Busca automática de oportunidades.", group: "Plataformas de freelance" },
  { key: "99freelas", name: "99Freelas", description: "Busca automática de oportunidades.", group: "Plataformas de freelance" },
  { key: "upwork", name: "Upwork", description: "Busca automática de oportunidades.", group: "Plataformas de freelance" },
  { key: "freelancer", name: "Freelancer.com", description: "Busca automática de oportunidades.", group: "Plataformas de freelance" },
  { key: "linkedin", name: "LinkedIn", description: "Busca automática de oportunidades.", group: "Plataformas de freelance" },
  { key: "gmail", name: "Gmail", description: "Recebe alertas e resumos por e-mail.", group: "Notificações" },
  { key: "whatsapp", name: "WhatsApp", description: "Recebe alertas instantâneos.", group: "Notificações" },
  { key: "telegram", name: "Telegram", description: "Recebe alertas instantâneos.", group: "Notificações" },
];

export const DEFAULT_CONNECTED: Record<string, boolean> = {
  workana: true,
  "99freelas": true,
};
