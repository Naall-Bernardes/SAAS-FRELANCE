"use client";

import { useState } from "react";
import { ExternalLink, FolderOpen, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { TagInput } from "@/components/ui/TagInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { SEED_PORTFOLIO, type PortfolioProject } from "@/lib/portfolio";

const EMPTY_DRAFT: Omit<PortfolioProject, "id"> = {
  name: "",
  description: "",
  technologies: [],
  problem: "",
  result: "",
  client: "",
  link: "",
};

export function PortfolioBoard() {
  const [projects, setProjects] = useLocalStorageState<PortfolioProject[]>("saas-frelance:portfolio", SEED_PORTFOLIO);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  function save() {
    if (!draft.name.trim()) return;
    setProjects((prev) => [{ ...draft, id: `pf-${Date.now()}` }, ...prev]);
    setDraft(EMPTY_DRAFT);
    setModalOpen(false);
  }

  function remove(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Adicionar projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Nenhum projeto cadastrado"
          description="Adicione projetos que a IA vai usar automaticamente ao gerar suas propostas."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{project.name}</h3>
                <button
                  type="button"
                  onClick={() => remove(project.id)}
                  aria-label="Remover projeto"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-subtle-foreground hover:bg-critical-soft hover:text-critical"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5 border-t border-border pt-3 text-xs">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Problema:</span> {project.problem}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Resultado:</span> {project.result}
                </p>
                <p className="text-subtle-foreground">Cliente: {project.client || "—"}</p>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                  Ver projeto
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Adicionar projeto">
        <div className="space-y-4">
          <TextField label="Nome" value={draft.name} onChange={(name) => setDraft((d) => ({ ...d, name }))} />
          <TextField
            label="Descrição"
            value={draft.description}
            onChange={(description) => setDraft((d) => ({ ...d, description }))}
            multiline
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
              Tecnologias
            </label>
            <TagInput value={draft.technologies} onChange={(technologies) => setDraft((d) => ({ ...d, technologies }))} />
          </div>
          <TextField label="Problema solucionado" value={draft.problem} onChange={(problem) => setDraft((d) => ({ ...d, problem }))} multiline />
          <TextField label="Resultado" value={draft.result} onChange={(result) => setDraft((d) => ({ ...d, result }))} multiline />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Cliente" value={draft.client} onChange={(client) => setDraft((d) => ({ ...d, client }))} />
            <TextField label="Link" value={draft.link} onChange={(link) => setDraft((d) => ({ ...d, link }))} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!draft.name.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      )}
    </div>
  );
}
