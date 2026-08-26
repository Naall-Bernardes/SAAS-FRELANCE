export interface Settings {
  notifications: {
    sistema: boolean;
    email: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
  language: string;
  timezone: string;
  privacy: {
    profilePublic: boolean;
    shareUsageData: boolean;
  };
  accountEmail: string;
}

export const DEFAULT_SETTINGS: Settings = {
  notifications: { sistema: true, email: true, whatsapp: false, telegram: false },
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  privacy: { profilePublic: false, shareUsageData: true },
  accountEmail: "",
};

export const LANGUAGES = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
];

export const TIMEZONES = [
  { value: "America/Sao_Paulo", label: "Brasília (GMT-3)" },
  { value: "America/New_York", label: "Nova York (GMT-5)" },
  { value: "Europe/Lisbon", label: "Lisboa (GMT+0)" },
];
