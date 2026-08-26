import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic"; // sempre busca dados frescos do banco

interface PageProps {
  searchParams: Promise<{ q?: string; source?: string; minBudget?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { q, source, minBudget } = await searchParams;

  const [opportunities, sources] = await Promise.all([
    prisma.opportunity.findMany({
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
          source ? { source: { key: source } } : {},
          minBudget ? { budgetMin: { gte: Number(minBudget) } } : {},
        ],
      },
      include: { source: true },
      orderBy: { postedAt: "desc" },
      take: 50,
    }),
    prisma.source.findMany(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">SAAS-FRELANCE</h1>
        <p className="text-gray-600">
          Oportunidades de freelance agregadas de Workana, 99Freelas, Freelancer.com e Upwork.
        </p>
      </header>

      <form className="mb-8 flex flex-wrap gap-3" method="get">
        <input
          type="text"
          name="q"
          placeholder="Buscar por palavra-chave..."
          defaultValue={q}
          className="flex-1 min-w-[200px] rounded border border-gray-300 px-3 py-2"
        />
        <select name="source" defaultValue={source ?? ""} className="rounded border border-gray-300 px-3 py-2">
          <option value="">Todas as fontes</option>
          {sources.map((s) => (
            <option key={s.key} value={s.key}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="minBudget"
          placeholder="Orçamento mín."
          defaultValue={minBudget}
          className="w-40 rounded border border-gray-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-white">
          Filtrar
        </button>
      </form>

      {opportunities.length === 0 ? (
        <p className="text-gray-500">
          Nenhuma oportunidade encontrada. Rode uma sincronização primeiro:{" "}
          <code className="rounded bg-gray-200 px-1">npm run sync</code>
        </p>
      ) : (
        <ul className="space-y-4">
          {opportunities.map((op) => (
            <li key={op.id} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-1 flex items-center justify-between gap-2">
                <a href={op.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 hover:underline">
                  {op.title}
                </a>
                <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {op.source.name}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-gray-600">{op.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                {op.category && <span>📁 {op.category}</span>}
                {(op.budgetMin || op.budgetMax) && (
                  <span>
                    💰 {op.budgetMin ?? "?"}
                    {op.budgetMax ? `–${op.budgetMax}` : ""} {op.currency ?? ""}
                  </span>
                )}
                {op.postedAt && <span>🕒 {new Date(op.postedAt).toLocaleDateString("pt-BR")}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
