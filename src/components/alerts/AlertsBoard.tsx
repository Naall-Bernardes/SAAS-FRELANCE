"use client";

import { useState } from "react";
import { Bell, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { TagInput } from "@/components/ui/TagInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { PLATFORMS, CATEGORIES } from "@/lib/demo-opportunities";
import {
  CHANNEL_LABELS,
  FREQUENCY_LABELS,
  SEED_ALERTS,
  type Alert,
  type AlertChannel,
  type AlertFrequency,
} from "@/lib/alerts";

const EMPTY_DRAFT: Omit<Alert, "id" | "foundCount" | "lastRunAt"> = {
  name: "",
  keywords: [],
  platforms: [],
  minValue: undefined,
  minMatch: undefined,
  maxCompetition: "",
  category: "",
  frequency: "instantaneo",
  channels: ["sistema"],
  active: true,
};

export function AlertsBoard() {
  const [alerts, setAlerts] = useLocalStorageState<Alert[]>("saas-frelance:alerts", SEED_ALERTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setModalOpen(true);
  }

  function openEdit(alert: Alert) {
    setEditingId(alert.id);
    setDraft(alert);
    setModalOpen(true);
  }

  function save() {
    if (!draft.name.trim()) return;
    if (editingId) {
      setAlerts((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...draft } : a)));
    } else {
      setAlerts((prev) => [
        { ...draft, id: `alert-${Date.now()}`, foundCount: 0, lastRunAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    setModalOpen(false);
  }

  function toggleActive(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }

  function remove(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  function togglePlatform(platform: string) {
    setDraft((d) => ({
      ...d,
      platforms: d.platforms.includes(platform) ? d.platforms.filter((p) => p !== platform) : [...d.platforms, platform],
    }));
  }

  function toggleChannel(channel: AlertChannel) {
    setDraft((d) => ({
      ...d,
      channels: d.channels.includes(channel) ? d.channels.filter((c) => c !== channel) : [...d.channels, channel],
    }));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Criar alerta
        </button>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhum alerta configurado"
          description="Crie um alerta pra ser avisado assim que surgir uma oportunidade que combina com você."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Criar alerta
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{alert.name}</h3>
                    <Badge variant={alert.active ? "good" : "neutral"}>{alert.active ? "Ativo" : "Pausado"}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {alert.keywords.length > 0 ? alert.keywords.join(", ") : "Sem palavras-chave"}
                    {alert.platforms.length > 0 && ` · ${alert.platforms.join(", ")}`}
                    {alert.minValue ? ` · a partir de R$ ${alert.minValue}` : ""}
                    {alert.minMatch ? ` · Match ≥ ${alert.minMatch}%` : ""}
                  </p>
                  <p className="mt-2 text-xs text-subtle-foreground">
                    {alert.foundCount} oportunidades encontradas · {FREQUENCY_LABELS[alert.frequency]} · última
                    execução <RelativeTime date={new Date(alert.lastRunAt)} />
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <div className="mr-1">
                    <Switch checked={alert.active} onChange={() => toggleActive(alert.id)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => openEdit(alert)}
                    title="Editar"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(alert.id)}
                    title="Excluir"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-critical-soft hover:text-critical"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar alerta" : "Criar alerta"}>
        <div className="space-y-4">
          <Field label="Nome do alerta">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Ex: Power BI acima de R$ 1.000"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </Field>

          <Field label="Palavras-chave">
            <TagInput value={draft.keywords} onChange={(keywords) => setDraft((d) => ({ ...d, keywords }))} />
          </Field>

          <Field label="Plataformas">
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    draft.platforms.includes(p)
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Valor mínimo (R$)">
              <input
                type="number"
                value={draft.minValue ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, minValue: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Match mínimo (%)">
              <input
                type="number"
                min={0}
                max={100}
                value={draft.minMatch ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, minMatch: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Concorrência máxima">
              <select
                value={draft.maxCompetition}
                onChange={(e) => setDraft((d) => ({ ...d, maxCompetition: e.target.value as Alert["maxCompetition"] }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Qualquer</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </Field>
            <Field label="Categoria">
              <select
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Qualquer</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Frequência">
            <select
              value={draft.frequency}
              onChange={(e) => setDraft((d) => ({ ...d, frequency: e.target.value as AlertFrequency }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Canal">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CHANNEL_LABELS) as AlertChannel[]).map((channel) => (
                <button
                  type="button"
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    draft.channels.includes(channel)
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  {CHANNEL_LABELS[channel]}
                </button>
              ))}
            </div>
          </Field>

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
              {editingId ? "Salvar alterações" : "Criar alerta"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
