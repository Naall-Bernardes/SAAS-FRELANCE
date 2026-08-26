import { ConnectorNotConfiguredError, type Connector, type FetchParams, type RawOpportunity } from "./types";

/**
 * Conector para a API oficial da Upwork.
 * Docs: https://developers.upwork.com/
 *
 * A Upwork exige um app registrado e aprovado + OAuth2 para acessar a API
 * de busca de vagas (Jobs Search API via GraphQL). Não há um endpoint
 * público anônimo, e fazer scraping direto do site viola os Termos de Uso
 * da Upwork — por isso este conector SÓ funciona com credenciais reais.
 *
 * Enquanto UPWORK_ACCESS_TOKEN não estiver configurado, ele fica desativado
 * e o agregador simplesmente pula esta fonte (ver lib/aggregator.ts).
 *
 * Para ativar:
 *  1. Crie um app em https://www.upwork.com/developer/apps
 *  2. Complete o fluxo OAuth2 e obtenha um access token
 *  3. Preencha UPWORK_CLIENT_ID / UPWORK_CLIENT_SECRET / UPWORK_ACCESS_TOKEN no .env
 *  4. Ajuste a query GraphQL abaixo conforme o schema atual da API (ela muda com frequência)
 */

const GRAPHQL_ENDPOINT = "https://api.upwork.com/graphql";

interface UpworkJob {
  id: string;
  title: string;
  description: string;
  ciphertext: string;
  amount?: { rawValue?: string; currency?: string };
  createdDateTime?: string;
  category?: string;
  skills?: Array<{ name: string }>;
}

export const upworkConnector: Connector = {
  key: "upwork",
  name: "Upwork",

  async fetchOpportunities(params: FetchParams = {}): Promise<RawOpportunity[]> {
    const token = process.env.UPWORK_ACCESS_TOKEN;
    if (!token) {
      throw new ConnectorNotConfiguredError(
        "upwork",
        "faltam credenciais OAuth (UPWORK_ACCESS_TOKEN). Ver comentário no topo deste arquivo."
      );
    }

    const { query = "", limit = 30 } = params;

    // Query ilustrativa — o schema GraphQL real da Upwork exige revisão na
    // documentação do seu app aprovado antes de usar em produção.
    const graphqlQuery = {
      query: `
        query SearchJobs($query: String, $first: Int) {
          marketplaceJobPostingsSearch(query: $query, first: $first) {
            edges {
              node {
                id
                title
                description
                ciphertext
                amount { rawValue currency }
                createdDateTime
                category
                skills { name }
              }
            }
          }
        }
      `,
      variables: { query, first: limit },
    };

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!res.ok) {
      throw new Error(`Upwork API respondeu ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const edges: Array<{ node: UpworkJob }> = data?.data?.marketplaceJobPostingsSearch?.edges ?? [];

    return edges.map(({ node }): RawOpportunity => ({
      externalId: node.id,
      title: node.title,
      description: node.description,
      url: `https://www.upwork.com/jobs/${node.ciphertext}`,
      budgetMin: node.amount?.rawValue ? Number(node.amount.rawValue) : undefined,
      currency: node.amount?.currency,
      category: node.category,
      skills: node.skills?.map((s) => s.name) ?? [],
      postedAt: node.createdDateTime ? new Date(node.createdDateTime) : undefined,
      raw: node,
    }));
  },
};
