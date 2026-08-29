/**
 * Contrato comum que todo conector de fonte de leilão deve implementar.
 * Cada conector sabe buscar lotes de UMA plataforma (Caixa, Leilo...) e
 * devolvê-los já normalizados no formato RawAuctionListing.
 *
 * Ver src/lib/connectors/types.ts — mesmo padrão usado pelos conectores de
 * oportunidades de freelance, só que para lotes de leilão.
 */

export type AuctionKind = "imovel" | "veiculo";

export interface RawAuctionListing {
  /** id do lote na plataforma de origem — usado para deduplicar */
  externalId: string;
  kind: AuctionKind;
  title: string;
  description: string;
  url: string;
  city?: string;
  state?: string;
  category?: string;
  evaluationValue?: number;
  minBidValue?: number;
  discountPct?: number;
  auctionDate?: Date;
  modality?: string;
  occupied?: boolean;
  imageUrl?: string;
  /** payload bruto original, guardado para depuração/auditoria */
  raw?: unknown;
}

export interface FetchParams {
  /** UF (ex: "SP") — a maioria das fontes de leilão exige um estado para buscar */
  state?: string;
  /** cidade, quando a fonte permitir filtrar por município */
  city?: string;
  /** termo de busca livre (ex: modelo do veículo, bairro) */
  query?: string;
  /** máximo de itens a retornar (best-effort, cada conector aplica como der) */
  limit?: number;
}

export interface AuctionConnector {
  /** slug estável da fonte, deve bater com AuctionSource.key no banco */
  key: string;
  /** nome amigável para exibir na UI */
  name: string;
  /** tipo de bem que esta fonte lista */
  kind: AuctionKind;
  fetchListings(params?: FetchParams): Promise<RawAuctionListing[]>;
}

/**
 * Erro esperado quando um conector não está configurado ou operacional
 * (ex: a fonte exige um handshake/token que ainda não foi implementado).
 * O agregador captura esse erro e apenas pula a fonte, sem derrubar o sync.
 */
export class AuctionConnectorNotConfiguredError extends Error {
  constructor(connectorKey: string, reason: string) {
    super(`Conector de leilão "${connectorKey}" não configurado: ${reason}`);
    this.name = "AuctionConnectorNotConfiguredError";
  }
}
