"use client";

import { useEffect, useState } from "react";
import { Download, Wand2 } from "lucide-react";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { DEMO_OPPORTUNITIES, PLATFORMS } from "@/lib/demo-opportunities";
import { DEFAULT_PROFILE, type Profile } from "@/lib/profile";
import {
  buildProposalTemplate,
  EMPTY_PROPOSAL_DRAFT,
  PROPOSAL_STYLES,
  type ProposalDraft,
  type ProposalStyle,
} from "@/lib/proposal-generator";
import { generateProposalPdf } from "@/lib/generate-proposal-pdf";

const CURRENCIES = ["BRL", "USD"];

export function ProposalGeneratorForm({ initialOpportunityId }: { initialOpportunityId?: string }) {
  const [profile] = useLocalStorageState<Profile>("saas-frelance:profile", DEFAULT_PROFILE);
  const [draft, setDraft] = useState<ProposalDraft>(EMPTY_PROPOSAL_DRAFT);
  const [selectedOpportunity, setSelectedOpportunity] = useState("");

  // Pré-preenche com o nome/cargo do perfil e, se veio de um card de
  // oportunidade ("Gerar proposta"), com os dados dela também.
  useEffect(() => {
    setDraft((d) => ({
      ...d,
      freelancerName: profile.name || d.freelancerName,
      freelancerTitle: profile.title || d.freelancerTitle,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name, profile.title]);

  useEffect(() => {
    if (!initialOpportunityId) return;
    loadFromOpportunity(initialOpportunityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOpportunityId]);

  function loadFromOpportunity(id: string) {
    const op = DEMO_OPPORTUNITIES.find((o) => o.id === id);
    if (!op) return;
    setSelectedOpportunity(id);
    setDraft((d) => ({
      ...d,
      clientName: op.client,
      projectTitle: op.title,
      platform: op.platform,
      scope: op.summary,
      deliverables: op.skills.map((s) => `Aplicação de ${s}`).join("\n"),
      value: op.value,
      currency: op.currency,
    }));
  }

  function regenerateBody() {
    setDraft((d) => ({ ...d, body: buildProposalTemplate(d) }));
  }

  function handleDownload() {
    generateProposalPdf(draft);
  }

  const canDownload = draft.projectTitle.trim() !== "" && draft.body.trim() !== "";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Esquerda — dados da oportunidade */}
      <div className="space-y-5">
        <Section title="Carregar de uma oportunidade" description="Opcional — preenche os campos abaixo automaticamente.">
          <select
            value={selectedOpportunity}
            onChange={(e) => (e.target.value ? loadFromOpportunity(e.target.value) : setSelectedOpportunity(""))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Preencher manualmente</option>
            {DEMO_OPPORTUNITIES.map((op) => (
              <option key={op.id} value={op.id}>
                {op.title} · {op.client}
              </option>
            ))}
          </select>
        </Section>

        <Section title="Dados da oportunidade">
          <div className="space-y-3">
            <Field label="Cliente">
              <input
                type="text"
                value={draft.clientName}
                onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Título do projeto">
              <input
                type="text"
                value={draft.projectTitle}
                onChange={(e) => setDraft((d) => ({ ...d, projectTitle: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
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
              <Field label="Prazo estimado">
                <input
                  type="text"
                  value={draft.deadline}
                  onChange={(e) => setDraft((d) => ({ ...d, deadline: e.target.value }))}
                  placeholder="Ex: 15 dias úteis"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </Field>
            </div>
            <Field label="Escopo / resumo">
              <textarea
                value={draft.scope}
                onChange={(e) => setDraft((d) => ({ ...d, scope: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Entregáveis (um por linha)">
              <textarea
                value={draft.deliverables}
                onChange={(e) => setDraft((d) => ({ ...d, deliverables: e.target.value }))}
                rows={3}
                placeholder={"Ex:\nDashboard com 5 painéis\nDocumentação de uso\n1 rodada de ajustes"}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor">
                <input
                  type="number"
                  value={draft.value || ""}
                  onChange={(e) => setDraft((d) => ({ ...d, value: Number(e.target.value) || 0 }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </Field>
              <Field label="Moeda">
                <select
                  value={draft.currency}
                  onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Seus dados">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Seu nome">
              <input
                type="text"
                value={draft.freelancerName}
                onChange={(e) => setDraft((d) => ({ ...d, freelancerName: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
            <Field label="Seu cargo">
              <input
                type="text"
                value={draft.freelancerTitle}
                onChange={(e) => setDraft((d) => ({ ...d, freelancerTitle: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </Field>
          </div>
        </Section>

        <Section title="Estilo da proposta">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PROPOSAL_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, style: s.value as ProposalStyle }))}
                title={s.description}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  draft.style === s.value
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-muted-foreground hover:bg-surface-hover"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Section>
      </div>

      {/* Direita — documento */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={regenerateBody}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            <Wand2 className="h-4 w-4" strokeWidth={1.75} />
            Gerar texto a partir do modelo
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!canDownload}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Baixar PDF
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 text-[#111] shadow-popover">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2a63b8]">Proposta comercial</p>
          <h2 className="mt-1 text-xl font-bold text-[#111]">{draft.projectTitle || "Título do projeto"}</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-y border-[#e5e5e5] py-3 text-xs text-[#5b5b5b]">
            <span>
              <strong className="text-[#111]">Cliente:</strong> {draft.clientName || "—"}
            </span>
            <span>
              <strong className="text-[#111]">Plataforma:</strong> {draft.platform || "—"}
            </span>
            <span>
              <strong className="text-[#111]">Prazo:</strong> {draft.deadline || "a combinar"}
            </span>
            <span>
              <strong className="text-[#111]">Data:</strong> {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>

          <textarea
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            placeholder='Clique em "Gerar texto a partir do modelo" pra começar, ou escreva sua proposta aqui.'
            rows={14}
            className="mt-4 w-full resize-y bg-transparent text-sm leading-relaxed text-[#222] placeholder:text-[#999] focus:outline-none"
          />

          <div className="mt-4 border-t border-[#e5e5e5] pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5b5b5b]">Investimento</p>
            <p className="mt-1 text-lg font-bold text-[#2a63b8]">
              {draft.value > 0
                ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: draft.currency }).format(draft.value)
                : "A combinar"}
            </p>
          </div>

          <div className="mt-6 border-t border-[#e5e5e5] pt-4 text-sm">
            <p className="font-semibold text-[#111]">{draft.freelancerName || "Seu nome"}</p>
            {draft.freelancerTitle && <p className="text-[#5b5b5b]">{draft.freelancerTitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-3">{children}</div>
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
