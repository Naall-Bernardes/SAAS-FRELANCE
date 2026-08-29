import type { AuctionConnector, FetchParams, RawAuctionListing } from "./types";
import { AuctionConnectorNotConfiguredError } from "./types";

/**
 * Conector para os imóveis à venda/leilão da Caixa Econômica Federal.
 *
 * IMPORTANTE — checado ao vivo em 2026-08-28 antes de escrever este conector:
 *
 *  - https://venda-imoveis.caixa.gov.br/sistema/busca-imovel.asp NÃO é uma
 *    página de listagem simples: é um wizard de 4 passos (Estado/Modalidade
 *    → Dados do imóvel → Dados do cliente → Resultados) que faz postback
 *    ASP clássico. Não existe URL GET estável com querystring que devolva o
 *    HTML de resultados direto — é preciso simular os passos do formulário.
 *  - O antigo endpoint público `/listaweb/Lista_imoveis_{UF}.csv`, usado por
 *    vários scrapers publicados, NÃO responde mais (redireciona pra busca).
 *    Não confie nele sem testar de novo antes de usar em produção.
 *  - Portanto cheerio (que só parseia HTML estático) não é suficiente aqui:
 *    é necessário um navegador headless (Playwright/Puppeteer) que abra a
 *    busca-imovel.asp, selecione Estado + Modalidade de venda, avance os
 *    passos do wizard e então leia a tabela de resultados renderizada.
 *  - Cada imóvel individual tem uma página de detalhe em
 *    `detalhe-imovel.asp?hdnimovel=<codigo>` com avaliação, valor mínimo de
 *    1ª/2ª praça, deságio, se está ocupado e a modalidade de venda — esses
 *    são os campos que preenchem o RawAuctionListing abaixo.
 *  - Respeite o robots.txt e os Termos de Uso do site, e mantenha um
 *    intervalo razoável entre requisições.
 *
 * fetchListings() abaixo é o esqueleto do fluxo: ele já resolve a URL base e
 * os parâmetros esperados pelo wizard, mas lança
 * AuctionConnectorNotConfiguredError até o passo de navegador headless ser
 * implementado. Trocar por Playwright é o próximo passo antes de ligar isso
 * em produção — por ora, o app usa dados de demonstração
 * (ver src/lib/demo-auctions.ts).
 */

const BASE_URL = "https://venda-imoveis.caixa.gov.br/sistema/busca-imovel.asp";

export const caixaConnector: AuctionConnector = {
  key: "caixa",
  name: "Caixa Imóveis",
  kind: "imovel",

  async fetchListings(params: FetchParams = {}): Promise<RawAuctionListing[]> {
    const { state, limit = 30 } = params;

    if (!state) {
      throw new AuctionConnectorNotConfiguredError(
        "caixa",
        "informe o parâmetro state (UF) — a busca da Caixa exige um estado antes de listar imóveis"
      );
    }

    const wizardUrl = `${BASE_URL}?sltTipoBusca=imoveis`;

    // TODO: trocar por um navegador headless (Playwright) que:
    //  1. abra `wizardUrl`
    //  2. selecione Estado=`state` (e Cidade/Modalidade quando informados)
    //  3. clique em "Próximo" até a etapa 4 (Resultados), respeitando `limit`
    //  4. leia a tabela/lista de cards de resultado com cheerio, já que a
    //     essa altura o HTML já foi renderizado pelo navegador headless.

    throw new AuctionConnectorNotConfiguredError(
      "caixa",
      `requer navegador headless para simular o wizard de busca em ${wizardUrl} (state=${state}, limit=${limit}) — ainda não implementado`
    );
  },
};
