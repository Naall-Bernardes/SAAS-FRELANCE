import { NextRequest, NextResponse } from "next/server";
import { syncAllSources } from "@/lib/aggregator";

/**
 * GET|POST /api/sync
 * Dispara a busca de oportunidades em todas as fontes configuradas e
 * persiste no banco. Aceita GET (Vercel Cron chama assim) e POST (chamada
 * manual/externa).
 *
 * Protegido por CRON_SECRET: se essa env var estiver definida no projeto
 * Vercel, a própria Vercel injeta automaticamente o header
 * `Authorization: Bearer <CRON_SECRET>` nas chamadas de cron — não precisa
 * configurar nada além da env var. Para chamar manualmente (curl, GitHub
 * Actions etc.), mande o mesmo header você mesmo.
 *
 * Query params opcionais:
 *   ?query=react   -> termo de busca repassado a todos os conectores
 */
async function handleSync(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("query") ?? "";
  const results = await syncAllSources(query);

  return NextResponse.json({ results });
}

export const GET = handleSync;
export const POST = handleSync;
