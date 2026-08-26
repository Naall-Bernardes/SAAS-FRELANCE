import { prisma } from "./db";
import { mockOpportunities, mockSources, type MockOpportunity } from "./mock-data";

/**
 * Camada de leitura usada pelo dashboard. Enquanto DATABASE_URL não estiver
 * configurado (ex: Supabase ainda não conectado), cai automaticamente para
 * dados de exemplo em memória — assim dá pra trabalhar no front sem
 * depender do backend. Assim que DATABASE_URL existir, passa a consultar o
 * Prisma normalmente, sem precisar mudar nada na UI.
 */

export interface OpportunityFilters {
  q?: string;
  source?: string;
  minBudget?: number;
}

export interface OpportunitiesResult {
  opportunities: MockOpportunity[];
  sources: { key: string; name: string }[];
  /** true quando os dados vieram do fallback de exemplo, não do banco real */
  usingMockData: boolean;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export async function getOpportunitiesData(filters: OpportunityFilters = {}): Promise<OpportunitiesResult> {
  if (hasDatabaseUrl) {
    try {
      const [opportunities, sources] = await Promise.all([
        prisma.opportunity.findMany({
          where: buildPrismaWhere(filters),
          include: { source: true },
          orderBy: { postedAt: "desc" },
          take: 50,
        }),
        prisma.source.findMany(),
      ]);
      return { opportunities, sources, usingMockData: false };
    } catch (err) {
      console.warn("[data] Falha ao consultar o banco, usando dados de exemplo:", err);
    }
  }

  return {
    opportunities: filterMockOpportunities(filters),
    sources: mockSources,
    usingMockData: true,
  };
}

function buildPrismaWhere(filters: OpportunityFilters) {
  const { q, source, minBudget } = filters;
  return {
    AND: [
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      source ? { source: { key: source } } : {},
      minBudget !== undefined ? { budgetMin: { gte: minBudget } } : {},
    ],
  };
}

function filterMockOpportunities(filters: OpportunityFilters): MockOpportunity[] {
  const { q, source, minBudget } = filters;
  return mockOpportunities.filter((op) => {
    if (source && op.source.key !== source) return false;
    if (minBudget !== undefined && (op.budgetMin ?? 0) < minBudget) return false;
    if (q) {
      const needle = q.toLowerCase();
      const haystack = `${op.title} ${op.description}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

// --- Analytics -------------------------------------------------------------

export interface CategoryCount {
  category: string;
  count: number;
}

export interface SourceCount {
  key: string;
  name: string;
  count: number;
}

export interface AnalyticsData {
  totalOpportunities: number;
  activeSources: number;
  avgBudget: number | null;
  /** contagem por categoria, ordenada desc; categorias além do topo N somadas em "Outras" */
  byCategory: CategoryCount[];
  /** contagem por fonte, ordenada desc */
  bySource: SourceCount[];
  usingMockData: boolean;
}

const MAX_CATEGORY_SLICES = 6;
const UNCATEGORIZED_LABEL = "Sem categoria";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  if (hasDatabaseUrl) {
    try {
      const [total, categoryGroups, sourceGroups, sources, budgetAvg] = await Promise.all([
        prisma.opportunity.count(),
        prisma.opportunity.groupBy({ by: ["category"], _count: { _all: true } }),
        prisma.opportunity.groupBy({ by: ["sourceId"], _count: { _all: true } }),
        prisma.source.findMany(),
        prisma.opportunity.aggregate({ _avg: { budgetMin: true } }),
      ]);

      const sourceById = new Map(sources.map((s) => [s.id, s]));
      const bySource = sourceGroups
        .map((g): SourceCount => {
          const s = sourceById.get(g.sourceId);
          return { key: s?.key ?? g.sourceId, name: s?.name ?? "Desconhecida", count: g._count._all };
        })
        .sort((a, b) => b.count - a.count);

      const byCategory = capCategories(
        categoryGroups
          .map((g): CategoryCount => ({ category: g.category ?? UNCATEGORIZED_LABEL, count: g._count._all }))
          .sort((a, b) => b.count - a.count)
      );

      return {
        totalOpportunities: total,
        activeSources: sources.length,
        avgBudget: budgetAvg._avg.budgetMin,
        byCategory,
        bySource,
        usingMockData: false,
      };
    } catch (err) {
      console.warn("[data] Falha ao consultar o banco, usando dados de exemplo:", err);
    }
  }

  return buildMockAnalytics();
}

function capCategories(sorted: CategoryCount[], max = MAX_CATEGORY_SLICES): CategoryCount[] {
  if (sorted.length <= max) return sorted;
  const head = sorted.slice(0, max - 1);
  const tailCount = sorted.slice(max - 1).reduce((sum, c) => sum + c.count, 0);
  return [...head, { category: "Outras", count: tailCount }];
}

function buildMockAnalytics(): AnalyticsData {
  const categoryTotals = new Map<string, number>();
  const sourceTotals = new Map<string, { name: string; count: number }>();
  const budgets: number[] = [];

  for (const op of mockOpportunities) {
    const category = op.category ?? UNCATEGORIZED_LABEL;
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + 1);

    const existing = sourceTotals.get(op.source.key);
    sourceTotals.set(op.source.key, { name: op.source.name, count: (existing?.count ?? 0) + 1 });

    if (typeof op.budgetMin === "number") budgets.push(op.budgetMin);
  }

  const byCategory = capCategories(
    [...categoryTotals.entries()]
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  );
  const bySource = [...sourceTotals.entries()]
    .map(([key, v]) => ({ key, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalOpportunities: mockOpportunities.length,
    activeSources: mockSources.length,
    avgBudget: budgets.length ? budgets.reduce((a, b) => a + b, 0) / budgets.length : null,
    byCategory,
    bySource,
    usingMockData: true,
  };
}
