"use client";

import { useMemo, useState } from "react";
import { Bookmark, FolderInput } from "lucide-react";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSavedOpportunities } from "@/lib/use-saved-opportunities";
import { COLLECTIONS, useCollections, type CollectionKey } from "@/lib/use-collections";
import { DEMO_OPPORTUNITIES } from "@/lib/demo-opportunities";

export function SavedBoard() {
  const { saved, toggle } = useSavedOpportunities();
  const { getCollection, setCollection } = useCollections();
  const [activeCollection, setActiveCollection] = useState<"all" | CollectionKey>("all");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const savedOpportunities = useMemo(
    () => DEMO_OPPORTUNITIES.filter((op) => saved.has(op.id) && !hidden.has(op.id)),
    [saved, hidden]
  );

  const counts = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const op of savedOpportunities) {
      const c = getCollection(op.id);
      acc[c] = (acc[c] ?? 0) + 1;
    }
    return acc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedOpportunities]);

  const visible =
    activeCollection === "all"
      ? savedOpportunities
      : savedOpportunities.filter((op) => getCollection(op.id) === activeCollection);

  if (savedOpportunities.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="Nenhuma oportunidade salva ainda"
        description="Clique em “Salvar” em qualquer oportunidade (nas telas Oportunidades ou Radar) pra ela aparecer aqui, organizada em coleções."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <nav className="space-y-0.5">
          <CollectionTab
            label="Todas"
            count={savedOpportunities.length}
            active={activeCollection === "all"}
            onClick={() => setActiveCollection("all")}
          />
          {COLLECTIONS.map((c) => (
            <CollectionTab
              key={c.key}
              label={c.label}
              count={counts[c.key] ?? 0}
              active={activeCollection === c.key}
              onClick={() => setActiveCollection(c.key)}
            />
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        {visible.length === 0 ? (
          <EmptyState
            icon={FolderInput}
            title="Coleção vazia"
            description="Mova oportunidades salvas pra cá usando o seletor de coleção em cada card."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {visible.map((op) => (
              <div key={op.id} className="space-y-2">
                <OpportunityCard
                  op={op}
                  saved={saved.has(op.id)}
                  onToggleSave={() => toggle(op.id)}
                  onIgnore={() => setHidden((prev) => new Set(prev).add(op.id))}
                />
                <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                  <FolderInput className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Coleção
                  <select
                    value={getCollection(op.id)}
                    onChange={(e) => setCollection(op.id, e.target.value as CollectionKey)}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {COLLECTIONS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-accent-soft text-accent" : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {label}
      <span className="rounded-full bg-surface-hover px-1.5 text-xs text-subtle-foreground">{count}</span>
    </button>
  );
}
