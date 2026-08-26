"use client";

import { useMemo, useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSavedOpportunities } from "@/lib/use-saved-opportunities";
import { CATEGORIES, DEMO_OPPORTUNITIES, PLATFORMS, type CompetitionLevel } from "@/lib/demo-opportunities";

type DatePreset = "30m" | "1h" | "6h" | "24h" | "7d" | "all";
type MatchTier = "90" | "80" | "70" | "all";
type SortBy = "match" | "recent" | "value" | "competition" | "hireChance";

const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "all", label: "Qualquer data" },
  { value: "30m", label: "Últimos 30 minutos" },
  { value: "1h", label: "Última hora" },
  { value: "6h", label: "Últimas 6 horas" },
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Últimos 7 dias" },
];

const DATE_PRESET_MINUTES: Record<Exclude<DatePreset, "all">, number> = {
  "30m": 30,
  "1h": 60,
  "6h": 360,
  "24h": 1440,
  "7d": 10080,
};

const MATCH_TIERS: { value: MatchTier; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "70", label: "Acima de 70%" },
  { value: "80", label: "Acima de 80%" },
  { value: "90", label: "Acima de 90%" },
];

const COMPETITION_LEVELS: CompetitionLevel[] = ["Baixa", "Média", "Alta"];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "match", label: "Maior Match" },
  { value: "recent", label: "Mais recente" },
  { value: "value", label: "Maior valor" },
  { value: "competition", label: "Menor concorrência" },
  { value: "hireChance", label: "Maior chance de contratação" },
];

export function OpportunitiesBoard({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [platforms, setPlatforms] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [valueMin, setValueMin] = useState("");
  const [valueMax, setValueMax] = useState("");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [matchTier, setMatchTier] = useState<MatchTier>("all");
  const [competitionLevels, setCompetitionLevels] = useState<Set<CompetitionLevel>>(new Set());
  const [sortBy, setSortBy] = useState<SortBy>("match");
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { saved, toggle } = useSavedOpportunities();

  const activeFilterCount =
    platforms.size + categories.size + competitionLevels.size + (datePreset !== "all" ? 1 : 0) +
    (matchTier !== "all" ? 1 : 0) + (valueMin ? 1 : 0) + (valueMax ? 1 : 0);

  const results = useMemo(() => {
    const now = Date.now();
    let list = DEMO_OPPORTUNITIES.filter((op) => !ignored.has(op.id));

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (op) =>
          op.title.toLowerCase().includes(q) ||
          op.summary.toLowerCase().includes(q) ||
          op.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (platforms.size > 0) list = list.filter((op) => platforms.has(op.platform));
    if (categories.size > 0) list = list.filter((op) => categories.has(op.category));

    const min = valueMin ? Number(valueMin) : undefined;
    const max = valueMax ? Number(valueMax) : undefined;
    if (min !== undefined && !Number.isNaN(min)) list = list.filter((op) => op.value >= min);
    if (max !== undefined && !Number.isNaN(max)) list = list.filter((op) => op.value <= max);

    if (datePreset !== "all") {
      const limitMin = DATE_PRESET_MINUTES[datePreset];
      list = list.filter((op) => (now - op.publishedAt.getTime()) / 60_000 <= limitMin);
    }
    if (matchTier !== "all") {
      const threshold = Number(matchTier);
      list = list.filter((op) => op.matchScore >= threshold);
    }
    if (competitionLevels.size > 0) list = list.filter((op) => competitionLevels.has(op.competitionLevel));

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.publishedAt.getTime() - a.publishedAt.getTime();
        case "value":
          return b.value - a.value;
        case "competition":
          return a.competitorsCount - b.competitorsCount;
        case "hireChance":
          return b.hireChance - a.hireChance;
        case "match":
        default:
          return b.matchScore - a.matchScore;
      }
    });
  }, [query, platforms, categories, valueMin, valueMax, datePreset, matchTier, competitionLevels, sortBy, ignored]);

  function clearFilters() {
    setPlatforms(new Set());
    setCategories(new Set());
    setValueMin("");
    setValueMax("");
    setDatePreset("all");
    setMatchTier("all");
    setCompetitionLevels(new Set());
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

      <CheckboxFilterGroup title="Plataforma" options={PLATFORMS} selected={platforms} onChange={setPlatforms} />
      <CheckboxFilterGroup title="Categoria" options={CATEGORIES} selected={categories} onChange={setCategories} />

      <FilterSection title="Valor">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mín."
            value={valueMin}
            onChange={(e) => setValueMin(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-subtle-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máx."
            value={valueMax}
            onChange={(e) => setValueMax(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </FilterSection>

      <FilterSection title="Data da publicação">
        <RadioFilterGroup options={DATE_PRESETS} value={datePreset} onChange={setDatePreset} />
      </FilterSection>

      <FilterSection title="Match IA">
        <RadioFilterGroup options={MATCH_TIERS} value={matchTier} onChange={setMatchTier} />
      </FilterSection>

      <CheckboxFilterGroup
        title="Concorrência"
        options={COMPETITION_LEVELS}
        selected={competitionLevels}
        onChange={(next) => setCompetitionLevels(next as Set<CompetitionLevel>)}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filtros — painel fixo no desktop, gaveta no mobile */}
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
            placeholder="Buscar oportunidades..."
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
          {results.length} oportunidade{results.length === 1 ? "" : "s"} encontrada{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="Nenhuma oportunidade com esses filtros"
            description="Tente ampliar o intervalo de valor, remover algum filtro de plataforma/categoria ou aumentar o período de data."
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
            {results.map((op) => (
              <OpportunityCard
                key={op.id}
                op={op}
                saved={saved.has(op.id)}
                onToggleSave={() => toggle(op.id)}
                onIgnore={() => setIgnored((prev) => new Set(prev).add(op.id))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">{title}</p>
      {children}
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
    <FilterSection title={title}>
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
    </FilterSection>
  );
}

function RadioFilterGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 border-border text-accent focus:ring-accent"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
