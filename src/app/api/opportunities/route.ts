import { NextRequest, NextResponse } from "next/server";
import { getOpportunitiesData } from "@/lib/data";

/**
 * GET /api/opportunities
 * Lista oportunidades, com filtros simples via query params:
 *   ?q=react          -> busca no título/descrição
 *   ?source=workana    -> filtra por fonte (key)
 *   ?minBudget=500      -> orçamento mínimo (budgetMin >= valor)
 *
 * Sem DATABASE_URL configurado, retorna dados de exemplo (usingMockData: true)
 * — ver src/lib/data.ts.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q") ?? undefined;
  const source = params.get("source") ?? undefined;
  const minBudget = params.get("minBudget") ? Number(params.get("minBudget")) : undefined;

  const { opportunities, usingMockData } = await getOpportunitiesData({ q, source, minBudget });

  return NextResponse.json({ opportunities, usingMockData });
}
