export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
}
export interface EducationItem {
  course: string;
  institution: string;
  period: string;
}
export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  skills: string[];
  languages: string[];
  hourlyRate?: number;
  availability?: string;
  country: string;
}

export const DEFAULT_PROFILE: Profile = {
  name: "",
  title: "Analista de Dados Freelancer",
  bio: "",
  experience: [],
  education: [],
  certifications: [],
  skills: ["Power BI", "Excel", "SQL"],
  languages: ["Português", "Inglês"],
  hourlyRate: 80,
  availability: "20h/semana",
  country: "Brasil",
};

interface StrengthCheck {
  pass: boolean;
  weight: number;
  recommendation: string;
}

export function computeProfileStrength(p: Profile): { percent: number; recommendations: string[] } {
  const checks: StrengthCheck[] = [
    { pass: p.name.trim().length > 0, weight: 10, recommendation: "Adicione seu nome completo." },
    { pass: p.title.trim().length > 0, weight: 10, recommendation: "Informe seu cargo ou especialidade." },
    { pass: p.bio.trim().length > 40, weight: 15, recommendation: "Escreva uma bio profissional com mais detalhes." },
    { pass: p.experience.length > 0, weight: 15, recommendation: "Complete sua experiência profissional." },
    { pass: p.education.length > 0, weight: 10, recommendation: "Adicione sua formação." },
    { pass: p.certifications.length > 0, weight: 10, recommendation: "Adicione certificações, se tiver." },
    { pass: p.skills.length >= 3, weight: 15, recommendation: "Cadastre pelo menos 3 habilidades, com resultados quantitativos quando possível." },
    { pass: p.languages.length > 0, weight: 5, recommendation: "Informe os idiomas que você fala." },
    { pass: !!p.hourlyRate, weight: 5, recommendation: "Defina seu valor/hora." },
    { pass: !!p.availability, weight: 5, recommendation: "Informe sua disponibilidade semanal." },
  ];

  const percent = checks.reduce((sum, c) => sum + (c.pass ? c.weight : 0), 0);
  const recommendations = checks.filter((c) => !c.pass).map((c) => c.recommendation);
  return { percent, recommendations };
}
