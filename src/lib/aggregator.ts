import { prisma } from "./db";
import { connectors, ConnectorNotConfiguredError } from "./connectors";
import type { RawOpportunity } from "./connectors/types";

export interface SyncResult {
  source: string;
  ok: boolean;
  fetched: number;
  upserted: number;
  error?: string;
}

/**
 * Roda todos os conectores registrados, normaliza e persiste as vagas no
 * banco (upsert por sourceId+externalId, então rodar de novo não duplica).
 * Um conector com erro (ou não configurado) não derruba os demais.
 */
export async function syncAllSources(query = ""): Promise<SyncResult[]> {
  const results: SyncResult[] = [];

  for (const connector of connectors) {
    try {
      const raw = await connector.fetchOpportunities({ query });
      const upserted = await persistOpportunities(connector.key, connector.name, raw);
      results.push({ source: connector.key, ok: true, fetched: raw.length, upserted });
    } catch (err) {
      if (err instanceof ConnectorNotConfiguredError) {
        results.push({ source: connector.key, ok: false, fetched: 0, upserted: 0, error: err.message });
      } else {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[aggregator] falha no conector ${connector.key}:`, message);
        results.push({ source: connector.key, ok: false, fetched: 0, upserted: 0, error: message });
      }
    }
  }

  return results;
}

async function persistOpportunities(
  sourceKey: string,
  sourceName: string,
  items: RawOpportunity[]
): Promise<number> {
  if (items.length === 0) return 0;

  const source = await prisma.source.upsert({
    where: { key: sourceKey },
    update: { name: sourceName },
    create: { key: sourceKey, name: sourceName },
  });

  let count = 0;
  for (const item of items) {
    await prisma.opportunity.upsert({
      where: { sourceId_externalId: { sourceId: source.id, externalId: item.externalId } },
      update: {
        title: item.title,
        description: item.description,
        url: item.url,
        budgetMin: item.budgetMin,
        budgetMax: item.budgetMax,
        currency: item.currency,
        category: item.category,
        skills: item.skills ?? [],
        postedAt: item.postedAt,
        fetchedAt: new Date(),
        raw: item.raw as object | undefined,
      },
      create: {
        sourceId: source.id,
        externalId: item.externalId,
        title: item.title,
        description: item.description,
        url: item.url,
        budgetMin: item.budgetMin,
        budgetMax: item.budgetMax,
        currency: item.currency,
        category: item.category,
        skills: item.skills ?? [],
        postedAt: item.postedAt,
        raw: item.raw as object | undefined,
      },
    });
    count++;
  }
  return count;
}
