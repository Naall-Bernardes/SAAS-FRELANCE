export type SkillLevel = "Iniciante" | "Intermediário" | "Avançado";
export interface Skill {
  name: string;
  level: SkillLevel;
}

export type MatchStrategy = "volume" | "equilibrado" | "precisao";

export interface MatchProfile {
  skills: Skill[];
  interests: string[];
  negativeKeywords: string[];
  minProjectValue?: number;
  minHourlyValue?: number;
  languages: string[];
  weeklyAvailability?: number;
  preferredPlatforms: string[];
  strategy: MatchStrategy;
}

export const INTERESTS = [
  "Dashboards",
  "Automação",
  "Análise de dados",
  "Desenvolvimento",
  "Engenharia",
  "Gestão de projetos",
  "Consultoria",
  "Outros",
];

export const STRATEGIES: { value: MatchStrategy; label: string; description: string }[] = [
  { value: "volume", label: "Mais oportunidades", description: "Mostra um volume maior de oportunidades." },
  { value: "equilibrado", label: "Equilibrado", description: "Balanceia qualidade e quantidade." },
  { value: "precisao", label: "Alta precisão", description: "Mostra apenas oportunidades altamente compatíveis." },
];

export const DEFAULT_MATCH_PROFILE: MatchProfile = {
  skills: [
    { name: "Power BI", level: "Avançado" },
    { name: "Excel", level: "Avançado" },
    { name: "Python", level: "Intermediário" },
    { name: "SQL", level: "Intermediário" },
    { name: "Gestão de Projetos", level: "Avançado" },
  ],
  interests: ["Dashboards", "Automação", "Análise de dados"],
  negativeKeywords: ["Criptomoeda", "Apostas"],
  minProjectValue: 800,
  minHourlyValue: 60,
  languages: ["Português", "Inglês"],
  weeklyAvailability: 20,
  preferredPlatforms: ["Workana", "99Freelas", "Freelancer.com"],
  strategy: "equilibrado",
};
