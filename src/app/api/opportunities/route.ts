import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/opportunities
 * Lista oportunidades salvas no banco, com filtros simples via query params:
 *   ?q=react          -> busca no título/descrição
 *   ?source=workana    -> filtra por fonte (key)
 *   ?category=...      -> filtra por categoria
 *   ?minBudget=500      -> orçamento mínimo (budgetMin >= valor)
 *   ?limit=50 &offset=0
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const q = params.get("q") ?? undefined;
  const sourceKey = params.get("source") ?? undefined;
  const category = params.get("category") ?? undefined;
  const minBudget = params.get("minBudget") ? Number(params.get("minBudget")) : undefined;
  const limit = Math.min(Number(params.get("limit") ?? 30), 100);
  const offset = Number(params.get("offset") ?? 0);

  const opportunities = await prisma.opportunity.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        sourceKey ? { source: { key: sourceKey } } : {},
        category ? { category: { equals: category, mode: "insensitive" } } : {},
        minBudget !== undefined ? { budgetMin: { gte: minBudget } } : {},
      ],
    },
    include: { source: true },
    orderBy: { postedAt: "desc" },
    take: limit,
    skip: offset,
  });

  return NextResponse.json({ opportunities });
}
