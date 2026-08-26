/**
 * Contrato comum que todo conector de fonte de oportunidades deve implementar.
 * Cada conector sabe buscar vagas de UMA plataforma (Workana, Upwork, etc.)
 * e devolvê-las já normalizadas no formato RawOpportunity.
 */

export interface RawOpportunity {
  /** id da vaga na plataforma de origem — usado para deduplicar */
  externalId: string;
  title: string;
  description: string;
  url: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  category?: string;
  skills?: string[];
  postedAt?: Date;
  /** payload bruto original, guardado para depuração/auditoria */
  raw?: unknown;
}

export interface FetchParams {
  /** termo de busca livre, ex: "desenvolvedor react" */
  query?: string;
  /** máximo de itens a retornar (best-effort, cada conector aplica como der) */
  limit?: number;
}

export interface Connector {
  /** slug estável da fonte, deve bater com Source.key no banco */
  key: string;
  /** nome amigável para exibir na UI */
  name: string;
  fetchOpportunities(params?: FetchParams): Promise<RawOpportunity[]>;
}

/**
 * Erro esperado quando um conector não está configurado (ex: falta API key).
 * O agregador captura esse erro e apenas pula a fonte, sem derrubar o sync.
 */
export class ConnectorNotConfiguredError extends Error {
  constructor(connectorKey: string, reason: string) {
    super(`Conector "${connectorKey}" não configurado: ${reason}`);
    this.name = "ConnectorNotConfiguredError";
  }
}
