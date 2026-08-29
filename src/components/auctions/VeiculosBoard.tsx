"use client";

import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { VeiculoCard } from "./VeiculoCard";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  DEMO_VEICULOS,
  ESTADOS,
  VEICULO_CATEGORIAS,
  VEICULO_ORIGENS,
  type VeiculoCategoria,
  type VeiculoOrigem,
} from "@/lib/demo-auctions";

type SortBy = "desconto" | "valor" | "km" | "leilao";

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "desconto", label: "Maior deságio vs. FIPE" },
  { value: "valor", label: "Menor lance atual" },
  { value: "km", label: "Menor quilometragem" },
  { value: "leilao", label: "Leilão mais próximo" },
];

function discountPct(fipeValue: number, currentBidValue: number): number {
  return (1 - currentBidValue / fipeValue) * 100;
}

export function VeiculosBoard() {
  const [query, setQuery] = useState("");
  const [states, setStates] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<VeiculoCategoria>>(new Set());
  const [origins, setOrigins] = useState<Set<VeiculoOrigem>>(new Set());
  const [onlyWithKey, setOnlyWithKey] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("desconto");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = states.size + categories.size + origins.size + (onlyWithKey ? 1 : 0);

  const results = useMemo(() => {
    let list = [...DEMO_VEICULOS];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((v) => v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
    }
    if (states.size > 0) list = list.filter((v) => states.has(v.state));
    if (categories.size > 0) list = list.filter((v) => categories.has(v.category));
    if (origins.size > 0) list = list.filter((v) => origins.has(v.origin));
    if (onlyWithKey) list = list.filter((v) => v.hasKey);

    return list.sort((a, b) => {
      switch (sortBy) {
        case "valor":
          return a.currentBidValue - b.currentBidValue;
        case "km":
          return a.km - b.km;
        case "leilao":
          return a.auctionDate.getTime() - b.auctionDate.getTime();
        case "desconto":
        default:
          return discountPct(b.fipeValue, b.currentBidValue) - discountPct(a.fipeValue, a.currentBidValue);
      }
    });
  }, [query, states, categories, origins, onlyWithKey, sortBy]);

  function clearFilters() {
    setStates(new Set());
    setCategories(new Set());
    setOrigins(new Set());
    setOnlyWithKey(false);
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
        options={VEICULO_CATEGORIAS}
        selected={categories as Set<string>}
        onChange={(next) => setCategories(next as Set<VeiculoCategoria>)}
      />
      <CheckboxFilterGroup
        title="Origem"
        options={VEICULO_ORIGENS}
        selected={origins as Set<string>}
        onChange={(next) => setOrigins(next as Set<VeiculoOrigem>)}
      />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">Chave</p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={onlyWithKey}
            onChange={(e) => setOnlyWithKey(e.target.checked)}
            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
          />
          Somente lotes com chave
        </label>
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
            placeholder="Buscar por marca ou modelo..."
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
          {results.length} veículo{results.length === 1 ? "" : "s"} encontrado{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="Nenhum veículo com esses filtros"
            description="Tente remover algum filtro de estado, categoria ou origem."
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
            {results.map((v) => (
              <VeiculoCard key={v.id} veiculo={v} />
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
