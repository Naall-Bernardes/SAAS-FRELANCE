"use client";

import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { ImovelCard } from "./ImovelCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  DEMO_IMOVEIS,
  ESTADOS,
  IMOVEL_CATEGORIAS,
  IMOVEL_MODALIDADES,
  type ImovelCategoria,
  type ImovelModalidade,
} from "@/lib/demo-auctions";

type Ocupacao = "todos" | "ocupado" | "desocupado";
type SortBy = "desconto" | "valor" | "leilao";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "desconto", label: "Maior deságio" },
  { value: "valor", label: "Menor valor de lance" },
  { value: "leilao", label: "Leilão mais próximo" },
];

export function ImoveisBoard() {
  const [query, setQuery] = useState("");
  const [states, setStates] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<ImovelCategoria>>(new Set());
  const [modalities, setModalities] = useState<Set<ImovelModalidade>>(new Set());
  const [ocupacao, setOcupacao] = useState<Ocupacao>("todos");
  const [sortBy, setSortBy] = useState<SortBy>("desconto");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = states.size + categories.size + modalities.size + (ocupacao !== "todos" ? 1 : 0);

  const results = useMemo(() => {
    let list = [...DEMO_IMOVEIS];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (im) =>
          im.title.toLowerCase().includes(q) ||
          im.city.toLowerCase().includes(q) ||
          im.neighborhood.toLowerCase().includes(q)
      );
    }
    if (states.size > 0) list = list.filter((im) => states.has(im.state));
    if (categories.size > 0) list = list.filter((im) => categories.has(im.category));
    if (modalities.size > 0) list = list.filter((im) => modalities.has(im.modality));
    if (ocupacao !== "todos") list = list.filter((im) => (ocupacao === "ocupado" ? im.occupied : !im.occupied));

    return list.sort((a, b) => {
      switch (sortBy) {
        case "valor":
          return a.firstBidValue - b.firstBidValue;
        case "leilao":
          return a.auctionDate.getTime() - b.auctionDate.getTime();
        case "desconto":
        default:
          return b.discountPct - a.discountPct;
      }
    });
  }, [query, states, categories, modalities, ocupacao, sortBy]);

  function clearFilters() {
    setStates(new Set());
    setCategories(new Set());
    setModalities(new Set());
    setOcupacao("todos");
  }

  const filterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filtros</h2>
        {activeFilterCount > 0 && (
          <button type="button" onClick={clearFilters} className="text-xs font-medium text-accent hover:underline">
            Limpar ({activeFilterCount})
          </button>
        )}
      </div>

      <CheckboxFilterGroup title="Estado" options={ESTADOS as unknown as string[]} selected={states} onChange={setStates} />
      <CheckboxFilterGroup
        title="Categoria"
        options={IMOVEL_CATEGORIAS}
        selected={categories as Set<string>}
        onChange={(next) => setCategories(next as Set<ImovelCategoria>)}
      />
      <CheckboxFilterGroup
        title="Modalidade"
        options={IMOVEL_MODALIDADES}
        selected={modalities as Set<string>}
        onChange={(next) => setModalities(next as Set<ImovelModalidade>)}
      />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">Ocupação</p>
        <div className="space-y-1.5">
          {(
            [
              { value: "todos", label: "Todos" },
              { value: "desocupado", label: "Desocupado" },
              { value: "ocupado", label: "Ocupado" },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="radio"
                checked={ocupacao === opt.value}
                onChange={() => setOcupacao(opt.value)}
                className="h-4 w-4 border-border text-accent focus:ring-accent"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-20 rounded-2xl border border-border bg-surface p-5">{filterPanel}</div>
      </aside>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-surface p-5 shadow-popover">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Filtros</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, cidade ou bairro..."
            className="min-w-[220px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover lg:hidden"
          >
            <Filter className="h-4 w-4" strokeWidth={1.75} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{activeFilterCount}</span>
            )}
          </button>

          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-subtle-foreground" strokeWidth={1.75} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="bg-transparent text-foreground focus:outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {results.length} imóve{results.length === 1 ? "l encontrado" : "is encontrados"}
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="Nenhum imóvel com esses filtros"
            description="Tente remover algum filtro de estado, categoria ou modalidade."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Limpar filtros
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {results.map((im) => (
              <ImovelCard key={im.id} imovel={im} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckboxFilterGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly string[];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  function toggle(value: string) {
    const next = new Set(selected);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    onChange(next);
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">{title}</p>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={selected.has(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
