"use client";

import { useState } from "react";
import { Pause, Pencil, Play, RefreshCw, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { TagInput } from "@/components/ui/TagInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { SEED_SEARCHES, type SavedSearch } from "@/lib/searches";

export function SearchesBoard() {
  const [searches, setSearches] = useLocalStorageState<SavedSearch[]>("saas-frelance:searches", SEED_SEARCHES);
  const [editing, setEditing] = useState<SavedSearch | null>(null);

  function runNow(id: string) {
    setSearches((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "ativa",
              foundToday: s.foundToday + Math.max(1, Math.round(Math.random() * 6)),
              lastUpdatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }

  function toggleStatus(id: string) {
    setSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "ativa" ? "pausada" : "ativa" } : s))
    );
  }

  function remove(id: string) {
    setSearches((prev) => prev.filter((s) => s.id !== id));
  }

  function saveEdit() {
    if (!editing) return;
    setSearches((prev) => prev.map((s) => (s.id === editing.id ? editing : s)));
    setEditing(null);
  }

  if (searches.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="Nenhuma busca configurada"
        description="Suas buscas automatizadas alimentam o Radar e as Oportunidades. Crie uma pra começar a receber vagas."
      />
    );
  }

  return (
    <div className="space-y-3">
      {searches.map((search) => (
        <div key={search.id} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{search.name}</h3>
                <Badge variant={search.status === "ativa" ? "good" : "neutral"}>
                  {search.status === "ativa" ? "🟢 Ativa" : "⚪ Pausada"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Palavras-chave: {search.keywords.join(", ")}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">Fontes: {search.platformsCount} plataformas</p>
            </div>

            <div className="flex gap-6 text-sm">
              <Stat label="Encontradas hoje" value={String(search.foundToday)} />
              <Stat label="Match > 80%" value={String(search.matchAbove80)} />
              <Stat
                label="Última atualização"
                value={<RelativeTime date={new Date(search.lastUpdatedAt)} />}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setEditing(search)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
              Editar
            </button>
            <button
              type="button"
              onClick={() => runNow(search.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Executar agora
            </button>
            <button
              type="button"
              onClick={() => toggleStatus(search.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              {search.status === "ativa" ? (
                <>
                  <Pause className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Ativar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => remove(search.id)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-subtle-foreground hover:bg-critical-soft hover:text-critical"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              Excluir
            </button>
          </div>
        </div>
      ))}

      <Modal open={editing !== null} onClose={() => setEditing(null)} title="Editar busca">
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                Nome
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                Palavras-chave
              </label>
              <TagInput value={editing.keywords} onChange={(keywords) => setEditing({ ...editing, keywords })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-right">
      <p className="text-[11px] text-subtle-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}
