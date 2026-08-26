import * as cheerio from "cheerio";
import type { Connector, FetchParams, RawOpportunity } from "./types";

/**
 * Conector para a Workana via scraping da página pública de busca de projetos.
 *
 * A Workana NÃO oferece API pública oficial, então isso depende do HTML da
 * página de busca (https://www.workana.com/jobs). IMPORTANTE:
 *
 *  - Os seletores CSS abaixo são um ponto de partida best-effort e PRECISAM
 *    ser conferidos contra o HTML real antes de ir pra produção (abra a
 *    página, inspecione um card de projeto e ajuste os seletores).
 *  - Se a listagem for renderizada via JavaScript (client-side), cheerio
 *    (que só parseia HTML estático) não vai enxergar os itens — nesse caso
 *    troque este conector por Playwright/Puppeteer (headless browser).
 *  - Respeite o robots.txt e os Termos de Uso da Workana, e mantenha um
 *    intervalo razoável entre requisições (não faça polling agressivo).
 */

const SEARCH_URL = "https://www.workana.com/jobs";

export const workanaConnector: Connector = {
  key: "workana",
  name: "Workana",

  async fetchOpportunities(params: FetchParams = {}): Promise<RawOpportunity[]> {
    const { query = "", limit = 30 } = params;

    const url = new URL(SEARCH_URL);
    url.searchParams.set("language", "pt");
    if (query) url.searchParams.set("query", query);

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": process.env.SCRAPER_USER_AGENT ?? "Mozilla/5.0",
        Accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`Workana respondeu ${res.status} ao buscar ${url.toString()}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const opportunities: RawOpportunity[] = [];

    // TODO: validar este seletor contra o HTML atual da Workana.
    $(".project-item").each((_, el) => {
      if (opportunities.length >= limit) return;

      const $el = $(el);
      const titleEl = $el.find(".project-title a, h2 a").first();
      const title = titleEl.text().trim();
      const href = titleEl.attr("href");
      if (!title || !href) return; // pula cards que não bateram com o seletor

      const url = href.startsWith("http") ? href : `https://www.workana.com${href}`;
      // ids de projeto costumam vir no final da URL (slug-numerico)
      const externalId = href.split("/").filter(Boolean).pop() ?? href;

      const description = $el.find(".project-details, .html-desc").first().text().trim();
      const budgetText = $el.find(".budget, .values .value").first().text().trim();
      const skills = $el
        .find(".skills a, .tags a")
        .map((_, s) => $(s).text().trim())
        .get();

      opportunities.push({
        externalId,
        title,
        description,
        url,
        currency: budgetText.match(/[A-Z]{2,3}\$|\$|R\$/)?.[0],
        skills,
        raw: { html: $el.html() },
      });
    });

    return opportunities;
  },
};
