import { prisma } from "./db";
import { auctionConnectors, AuctionConnectorNotConfiguredError } from "./auction-connectors";
import type { RawAuctionListing } from "./auction-connectors/types";

export interface AuctionSyncResult {
  source: string;
  ok: boolean;
  fetched: number;
  upserted: number;
  error?: string;
}

/**
 * Roda todos os conectores de leilão registrados, normaliza e persiste os
 * lotes no banco (upsert por sourceId+externalId, então rodar de novo não
 * duplica). Um conector com erro (ou não configurado) não derruba os demais.
 *
 * Ver src/lib/aggregator.ts — mesmo padrão usado pra sincronizar
 * oportunidades de freelance, aplicado aqui a lotes de leilão.
 */
export async function syncAllAuctionSources(params: { state?: string; query?: string } = {}): Promise<
  AuctionSyncResult[]
> {
  const results: AuctionSyncResult[] = [];

  for (const connector of auctionConnectors) {
    try {
      const raw = await connector.fetchListings(params);
      const upserted = await persistListings(connector.key, connector.name, raw);
      results.push({ source: connector.key, ok: true, fetched: raw.length, upserted });
    } catch (err) {
      if (err instanceof AuctionConnectorNotConfiguredError) {
        results.push({ source: connector.key, ok: false, fetched: 0, upserted: 0, error: err.message });
      } else {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[auction-aggregator] falha no conector ${connector.key}:`, message);
        results.push({ source: connector.key, ok: false, fetched: 0, upserted: 0, error: message });
      }
    }
  }

  return results;
}

async function persistListings(
  sourceKey: string,
  sourceName: string,
  items: RawAuctionListing[]
): Promise<number> {
  if (items.length === 0) return 0;

  const source = await prisma.auctionSource.upsert({
    where: { key: sourceKey },
    update: { name: sourceName },
    create: { key: sourceKey, name: sourceName, kind: items[0].kind },
  });

  let count = 0;
  for (const item of items) {
    await prisma.auctionListing.upsert({
      where: { sourceId_externalId: { sourceId: source.id, externalId: item.externalId } },
      update: {
        kind: item.kind,
        title: item.title,
        description: item.description,
        url: item.url,
        city: item.city,
        state: item.state,
        category: item.category,
        evaluationValue: item.evaluationValue,
        minBidValue: item.minBidValue,
        discountPct: item.discountPct,
        auctionDate: item.auctionDate,
        modality: item.modality,
        occupied: item.occupied,
        imageUrl: item.imageUrl,
        fetchedAt: new Date(),
        raw: item.raw as object | undefined,
      },
      create: {
        sourceId: source.id,
        externalId: item.externalId,
        kind: item.kind,
        title: item.title,
        description: item.description,
        url: item.url,
        city: item.city,
        state: item.state,
        category: item.category,
        evaluationValue: item.evaluationValue,
        minBidValue: item.minBidValue,
        discountPct: item.discountPct,
        auctionDate: item.auctionDate,
        modality: item.modality,
        occupied: item.occupied,
        imageUrl: item.imageUrl,
        raw: item.raw as object | undefined,
      },
    });
    count++;
  }
  return count;
}
