import type { Connector, FetchParams, RawOpportunity } from "./types";

/**
 * Conector para a API pública da Freelancer.com.
 * Docs: https://developers.freelancer.com/docs/projects/projects
 *
 * A busca de projetos ativos funciona sem autenticação, mas um token OAuth
 * (FREELANCER_OAUTH_TOKEN) aumenta o rate limit e evita bloqueios.
 *
 * OBS: a Freelancer.com muda o shape da resposta com alguma frequência —
 * se algum campo vier undefined, confira a resposta bruta em `raw` antes
 * de assumir que o mapeamento quebrou.
 */

const API_BASE = "https://www.freelancer.com/api/projects/0.1/projects/active/";

interface FreelancerApiProject {
  id: number;
  title: string;
  seo_url?: string;
  preview_description?: string;
  budget?: { minimum?: number; maximum?: number };
  currency?: { code?: string };
  submitdate?: number; // unix timestamp em segundos
  jobs?: Array<{ name: string }>;
}

interface FreelancerApiResponse {
  status: string;
  result?: { projects?: FreelancerApiProject[] };
}

export const freelancerConnector: Connector = {
  key: "freelancer",
  name: "Freelancer.com",

  async fetchOpportunities(params: FetchParams = {}): Promise<RawOpportunity[]> {
    const { query = "", limit = 30 } = params;

    const url = new URL(API_BASE);
    if (query) url.searchParams.set("query", query);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("compact", "true");
    url.searchParams.set("job_details", "true");
    url.searchParams.set("full_description", "false");

    const headers: Record<string, string> = { Accept: "application/json" };
    const token = process.env.FREELANCER_OAUTH_TOKEN;
    if (token) headers["freelancer-oauth-v1"] = token;

    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      throw new Error(`Freelancer.com API respondeu ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as FreelancerApiResponse;
    const projects = data.result?.projects ?? [];

    return projects.map((p): RawOpportunity => ({
      externalId: String(p.id),
      title: p.title,
      description: p.preview_description ?? "",
      url: p.seo_url
        ? `https://www.freelancer.com/projects/${p.seo_url}`
        : `https://www.freelancer.com/projects/${p.id}`,
      budgetMin: p.budget?.minimum,
      budgetMax: p.budget?.maximum,
      currency: p.currency?.code,
      category: p.jobs?.[0]?.name,
      skills: p.jobs?.map((j) => j.name) ?? [],
      postedAt: p.submitdate ? new Date(p.submitdate * 1000) : undefined,
      raw: p,
    }));
  },
};
