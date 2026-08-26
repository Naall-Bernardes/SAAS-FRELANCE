"use client";

import { Fragment, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  FileText,
  FolderOpen,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Send,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { PLATFORMS } from "@/lib/demo-opportunities";
import {
  EMPTY_CLIENT,
  SEED_CLIENTS,
  STATUS_OPTIONS,
  type Client,
  type ClientHistoryItem,
  type ClientStatus,
} from "@/lib/clients";

const HISTORY_ICON: Record<ClientHistoryItem["type"], LucideIcon> = {
  oportunidade: Briefcase,
  proposta: FileText,
  mensagem: MessageSquare,
  projeto: FolderOpen,
  contratacao: CheckCircle2,
};

export function ClientsBoard() {
  const [clients, setClients] = useLocalStorageState<Client[]>("saas-frelance:clients", SEED_CLIENTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_CLIENT);
  const [contactDraft, setContactDraft] = useState("");

  function openCreate() {
    setEditingId(null);
    setDraft(EMPTY_CLIENT);
    setModalOpen(true);
  }

  function openEdit(client: Client) {
    setEditingId(client.id);
    setDraft(client);
    setModalOpen(true);
  }

  function save() {
    if (!draft.name.trim()) return;
    if (editingId) {
      setClients((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...draft } : c)));
    } else {
      setClients((prev) => [
        { ...draft, id: `cl-${Date.now()}`, lastContactAt: new Date().toISOString(), history: [] },
        ...prev,
      ]);
    }
    setModalOpen(false);
  }

  function remove(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (expanded === id) setExpanded(null);
  }

  function changeStatus(id: string, status: ClientStatus) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function registerContact(id: string) {
    const label = contactDraft.trim();
    if (!label) return;
    const now = new Date().toISOString();
    setClients((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, lastContactAt: now, history: [...c.history, { type: "mensagem", label, at: now }] }
          : c
      )
    );
    setContactDraft("");
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nenhum cliente cadastrado"
        description="Cadastre um cliente pra começar a acompanhar o histórico de oportunidades, propostas e contatos."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            Cadastrar cliente
          </button>
        }
      />
    );
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
          Novo cliente
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-subtle-foreground">
              <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
              <th scope="col" className="px-4 py-3 font-medium">Plataforma</th>
              <th scope="col" className="px-4 py-3 font-medium">País</th>
              <th scope="col" className="px-4 py-3 font-medium">Projetos</th>
              <th scope="col" className="px-4 py-3 font-medium">Valor total</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Último contato</th>
              <th scope="col" className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const isOpen = expanded === client.id;
              return (
                <Fragment key={client.id}>
                  <tr className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td
                      onClick={() => setExpanded(isOpen ? null : client.id)}
                      className="cursor-pointer px-4 py-3 font-medium text-foreground"
                    >
                      {client.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{client.platform}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{client.country}</td>
                    <td className="px-4 py-3 text-muted-foreground">{client.projectsCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
                        client.totalValue
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <select
                        value={client.status}
                        onChange={(e) => changeStatus(client.id, e.target.value as ClientStatus)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      <RelativeTime date={new Date(client.lastContactAt)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(client)}
                          title="Editar"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(client.id)}
                          title="Excluir"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-critical-soft hover:text-critical"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : client.id)}
                          title="Ver histórico"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-border bg-background last:border-0">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                              Contato
                            </p>
                            <div className="space-y-1.5 text-sm text-foreground">
                              <p className="text-muted-foreground">{client.contactName || "Sem nome de contato"}</p>
                              {client.email && (
                                <p className="flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 text-subtle-foreground" strokeWidth={1.75} />
                                  {client.email}
                                </p>
                              )}
                              {client.phone && (
                                <p className="flex items-center gap-1.5">
                                  <Phone className="h-3.5 w-3.5 text-subtle-foreground" strokeWidth={1.75} />
                                  {client.phone}
                                </p>
                              )}
                              {client.notes && <p className="text-muted-foreground">{client.notes}</p>}
                            </div>

                            <div className="mt-4 flex gap-2">
                              <input
                                type="text"
                                value={expanded === client.id ? contactDraft : ""}
                                onChange={(e) => setContactDraft(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && registerContact(client.id)}
                                placeholder="Registrar novo contato (ex: liguei, ele respondeu...)"
                                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                              <button
                                type="button"
                                onClick={() => registerContact(client.id)}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                              >
                                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                                Registrar
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                              Histórico
                            </p>
                            {client.history.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Nenhum evento registrado ainda.</p>
                            ) : (
                              <ul className="space-y-2">
                                {[...client.history]
                                  .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                                  .map((item, i) => {
                                    const Icon = HISTORY_ICON[item.type];
                                    return (
                                      <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted-foreground">
                                          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                                        </span>
                                        {item.label}
                                        <span className="ml-auto shrink-0 text-xs text-subtle-foreground">
                                          <RelativeTime date={new Date(item.at)} />
                                        </span>
                                      </li>
                                    );
                                  })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar cliente" : "Novo cliente"}>
        <div className="space-y-4">
          <Field label="Nome">
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Nome do cliente/empresa"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Plataforma">
              <select
                value={draft.platform}
                onChange={(e) => setDraft((d) => ({ ...d, platform: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ClientStatus }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="País">
              <input
                type="text"
                value={draft.country}
                onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Valor total negociado (R$)">
              <input
                type="number"
                value={draft.totalValue}
                onChange={(e) => setDraft((d) => ({ ...d, totalValue: Number(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
          </div>

          <Field label="Nome do contato">
            <input
              type="text"
              value={draft.contactName}
              onChange={(e) => setDraft((d) => ({ ...d, contactName: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="E-mail">
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Telefone">
              <input
                type="text"
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                placeholder="+55 11 90000-0000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
          </div>

          <Field label="Observações">
            <textarea
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
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
              {editingId ? "Salvar alterações" : "Cadastrar cliente"}
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
