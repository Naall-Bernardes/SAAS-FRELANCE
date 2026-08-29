import type { AuctionConnector, FetchParams, RawAuctionListing } from "./types";
import { AuctionConnectorNotConfiguredError } from "./types";

/**
 * Conector para os lotes de veículos do site Leilo (leilo.com.br).
 *
 * IMPORTANTE — checado ao vivo em 2026-08-28 antes de escrever este conector:
 *
 *  - leilo.com.br é uma SPA (Vue/Quasar) — o HTML estático não contém os
 *    lotes, então cheerio sozinho não enxerga nada; o site busca os dados
 *    de uma API separada em `https://api.leilo.com.br`.
 *  - Batendo direto em `https://api.leilo.com.br/lotes` (e variações como
 *    `/leiloes`, `/v1/lotes`, `/public/lotes`) sem os headers que o
 *    front-end envia devolve 401 `{"message":"Token inválido"}` — a API
 *    exige um token (aparentemente um token anônimo emitido pelo próprio
 *    app ao carregar, não uma chave documentada publicamente). Não tente
 *    "adivinhar" esse token; capture a requisição real do navegador
 *    (Network tab / mcp read_network_requests) para saber que header ela
 *    usa antes de automatizar isso.
 *  - Categorias confirmadas na home: Carros, Motos, Pesados, Utilitários,
 *    Equipamentos, Sucatas e Imóveis — cada lote traz UF, categoria/origem
 *    (“Recuperado de Financiamento”, “Recuperado de Seguradora” etc.), KM,
 *    quantidade de fotos, lance atual/mínimo e data do leilão.
 *  - Caminho recomendado pra produção: (a) descobrir e reproduzir o
 *    handshake de token da API oficial, ou (b) usar um navegador headless
 *    que abra leilo.com.br, aplique os filtros de categoria/UF e leia o
 *    grid de lotes já renderizado.
 *  - Respeite o robots.txt e os Termos de Uso do site, e mantenha um
 *    intervalo razoável entre requisições.
 *
 * fetchListings() abaixo lança AuctionConnectorNotConfiguredError até um
 * dos dois caminhos acima ser implementado — por ora, o app usa dados de
 * demonstração (ver src/lib/demo-auctions.ts).
 */

const API_BASE_URL = "https://api.leilo.com.br";

export const leiloConnector: AuctionConnector = {
  key: "leilo",
  name: "Leilo",
  kind: "veiculo",

  async fetchListings(_params: FetchParams = {}): Promise<RawAuctionListing[]> {
    // _params (state/query/limit) será usado assim que um dos caminhos
    // abaixo for implementado. TODO: implementar um dos dois. Ex. via API:
    //   const res = await fetch(`${API_BASE_URL}/lotes?categoria=carros&uf=${state}`, {
    //     headers: { Authorization: `Bearer ${process.env.LEILO_API_TOKEN}` },
    //   });
    // (LEILO_API_TOKEN ainda não existe — precisa ser obtido primeiro.)

    throw new AuctionConnectorNotConfiguredError(
      "leilo",
      `API em ${API_BASE_URL} exige um token não documentado publicamente — implementar handshake ou navegador headless antes de usar`
    );
  },
};
