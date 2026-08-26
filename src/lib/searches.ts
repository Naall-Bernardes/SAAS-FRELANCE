export interface SavedSearch {
  id: string;
  name: string;
  keywords: string[];
  platformsCount: number;
  status: "ativa" | "pausada";
  foundToday: number;
  matchAbove80: number;
  lastUpdatedAt: string; // ISO
}

export const SEED_SEARCHES: SavedSearch[] = [
  {
    id: "search-1",
    name: "Power BI",
    keywords: ["Power BI", "Dashboard", "DAX"],
    platformsCount: 5,
    status: "ativa",
    foundToday: 47,
    matchAbove80: 13,
    lastUpdatedAt: new Date(Date.now() - 2 * 60_000).toISOString(),
  },
  {
    id: "search-2",
    name: "React / Next.js",
    keywords: ["React", "Next.js", "TypeScript"],
    platformsCount: 4,
    status: "ativa",
    foundToday: 29,
    matchAbove80: 8,
    lastUpdatedAt: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: "search-3",
    name: "Automação com Python",
    keywords: ["Python", "Automação", "Pandas"],
    platformsCount: 3,
    status: "pausada",
    foundToday: 0,
    matchAbove80: 0,
    lastUpdatedAt: new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString(),
  },
  {
    id: "search-4",
    name: "Design gráfico e branding",
    keywords: ["Branding", "Identidade visual", "Figma"],
    platformsCount: 4,
    status: "ativa",
    foundToday: 18,
    matchAbove80: 3,
    lastUpdatedAt: new Date(Date.now() - 40 * 60_000).toISOString(),
  },
];
