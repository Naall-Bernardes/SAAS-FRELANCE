import { caixaConnector } from "./caixa";
import { leiloConnector } from "./leilo";
import type { AuctionConnector } from "./types";

/**
 * Registro central de conectores de leilão. Para adicionar uma nova fonte,
 * implemente a interface AuctionConnector em um novo arquivo e registre a
 * instância aqui — nada mais no resto do app precisa mudar.
 */
export const auctionConnectors: AuctionConnector[] = [caixaConnector, leiloConnector];

export * from "./types";
