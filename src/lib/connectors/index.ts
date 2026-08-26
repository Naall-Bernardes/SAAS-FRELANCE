import { freelancerConnector } from "./freelancer";
import { upworkConnector } from "./upwork";
import { workanaConnector } from "./workana";
import { freelas99Connector } from "./freelas99";
import type { Connector } from "./types";

/**
 * Registro central de conectores. Para adicionar uma nova fonte de
 * oportunidades, implemente a interface Connector em um novo arquivo
 * e registre a instância aqui — nada mais no resto do app precisa mudar.
 */
export const connectors: Connector[] = [
  workanaConnector,
  freelas99Connector,
  freelancerConnector,
  upworkConnector,
];

export * from "./types";
