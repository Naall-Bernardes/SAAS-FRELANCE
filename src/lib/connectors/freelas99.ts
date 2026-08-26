import * as cheerio from "cheerio";
import type { Connector, FetchParams, RawOpportunity } from "./types";

/**
 * Conector para a 99Freelas via scraping da página pública de projetos.
 *
 * Assim como a Workana, a 99Freelas não expõe API pública oficial. Os
 * mesmos avisos do conector da Workana valem aqui:
 *
 *  - Confira os seletores CSS abaixo contra o HTML real antes de produção.
 *  - Se a lista for renderizada via JS, troque cheerio por um headless
 *    browser (Playwright/Puppeteer).
 *  - Respeite robots.txt, Termos de Uso e um intervalo razoável entre requests.
 */

const SEARCH_URL = "https://www.99freelas.com.br/projects";

export const freelas99Connector: Connector = {
  key: "99freelas",
  name: "99Freelas",

  async fetchOpportunities(params: FetchParams = {}): Promise<RawOpportunity[]> {
    const { query = "", limit = 30 } = params;

    const url = new URL(SEARCH_URL);
    if (query) url.searchParams.set("q", query);

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": process.env.SCRAPER_USER_AGENT ?? "Mozilla/5.0",
        Accept: "text/html",
      },
    });

    if (!res.ok) {
      throw new Error(`99Freelas respondeu ${res.status} ao buscar ${url.toString()}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const opportunities: RawOpportunity[] = [];

    // TODO: validar este seletor contra o HTML atual da 99Freelas.
    $(".project-list-item, .project-card").each((_, el) => {
      if (opportunities.length >= limit) return;

      const $el = $(el);
      const titleEl = $el.find("a.project-title, h3 a, h2 a").first();
      const title = titleEl.text().trim();
      const href = titleEl.attr("href");
      if (!title || !href) return;

      const projUrl = href.startsWith("http") ? href : `https://www.99freelas.com.br${href}`;
      const externalId = href.split("/").filter(Boolean).pop() ?? href;

      const description = $el.find(".project-description, .description").first().text().trim();
      const budgetText = $el.find(".budget, .project-budget").first().text().trim();
      const category = $el.find(".category, .project-category").first().text().trim() || undefined;

      opportunities.push({
        externalId,
        title,
        description,
        url: projUrl,
        category,
        currency: budgetText.match(/R\$|\$/)?.[0],
        raw: { html: $el.html() },
      });
    });

    return opportunities;
  },
};
