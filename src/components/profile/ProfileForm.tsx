"use client";

import { useState } from "react";
import { Lightbulb, Plus, Trash2 } from "lucide-react";
import { TagInput } from "@/components/ui/TagInput";
import { Meter } from "@/components/ui/Meter";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import {
  computeProfileStrength,
  DEFAULT_PROFILE,
  type CertificationItem,
  type EducationItem,
  type ExperienceItem,
  type Profile,
} from "@/lib/profile";

export function ProfileForm() {
  const [profile, setProfile] = useLocalStorageState<Profile>("saas-frelance:profile", DEFAULT_PROFILE);
  const { percent, recommendations } = computeProfileStrength(profile);

  const initials =
    profile.name.trim().length > 0
      ? profile.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0]?.toUpperCase())
          .join("")
      : "?";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-semibold text-accent-foreground">
            {initials}
          </div>
          <div className="min-w-[220px] flex-1 space-y-2">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Seu nome completo"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              placeholder="Cargo / especialidade"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="w-full shrink-0 sm:w-48">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted-foreground">Força do perfil</span>
              <span className="text-sm font-semibold text-foreground">{percent}%</span>
            </div>
            <Meter value={percent} colorVar={percent >= 70 ? "--good" : percent >= 40 ? "--warning" : "--critical"} />
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-warning bg-warning-soft p-5">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning">
            <Lightbulb className="h-4 w-4" strokeWidth={1.75} />
            Recomendações pra fortalecer seu perfil
          </h2>
          <ul className="space-y-1 text-sm text-warning">
            {recommendations.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Section title="Bio profissional">
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
          rows={4}
          placeholder="Conte em algumas frases quem você é, o que faz de melhor e que tipo de projeto procura."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </Section>

      <Section title="Experiência">
        <ListEditor<ExperienceItem>
          items={profile.experience}
          onChange={(experience) => setProfile((p) => ({ ...p, experience }))}
          fields={["role", "company", "period"]}
          placeholders={["Cargo", "Empresa/cliente", "Período (ex: 2022–atual)"]}
          empty={{ role: "", company: "", period: "" }}
          renderLabel={(item) => `${item.role} · ${item.company} (${item.period})`}
        />
      </Section>

      <Section title="Formação">
        <ListEditor<EducationItem>
          items={profile.education}
          onChange={(education) => setProfile((p) => ({ ...p, education }))}
          fields={["course", "institution", "period"]}
          placeholders={["Curso", "Instituição", "Período"]}
          empty={{ course: "", institution: "", period: "" }}
          renderLabel={(item) => `${item.course} · ${item.institution} (${item.period})`}
        />
      </Section>

      <Section title="Certificações">
        <ListEditor<CertificationItem>
          items={profile.certifications}
          onChange={(certifications) => setProfile((p) => ({ ...p, certifications }))}
          fields={["name", "issuer", "year"]}
          placeholders={["Certificação", "Emissor", "Ano"]}
          empty={{ name: "", issuer: "", year: "" }}
          renderLabel={(item) => `${item.name} · ${item.issuer} (${item.year})`}
        />
      </Section>

      <Section title="Skills">
        <TagInput value={profile.skills} onChange={(skills) => setProfile((p) => ({ ...p, skills }))} />
      </Section>

      <Section title="Idiomas">
        <TagInput value={profile.languages} onChange={(languages) => setProfile((p) => ({ ...p, languages }))} />
      </Section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Section title="Valor/hora (R$)">
          <input
            type="number"
            value={profile.hourlyRate ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, hourlyRate: e.target.value ? Number(e.target.value) : undefined }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
        <Section title="Disponibilidade">
          <input
            type="text"
            value={profile.availability ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, availability: e.target.value }))}
            placeholder="Ex: 20h/semana"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
        <Section title="País">
          <input
            type="text"
            value={profile.country}
            onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function ListEditor<T>({
  items,
  onChange,
  fields,
  placeholders,
  empty,
  renderLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  fields: (keyof T & string)[];
  placeholders: string[];
  empty: T;
  renderLabel: (item: T) => string;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(empty as Record<string, string>);

  function add() {
    if (!draft[fields[0]]?.trim()) return;
    onChange([...items, draft as unknown as T]);
    setDraft(empty as Record<string, string>);
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {renderLabel(item)}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                aria-label="Remover"
                className="flex h-6 w-6 items-center justify-center rounded text-subtle-foreground hover:bg-surface-hover hover:text-critical"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        {fields.map((field, i) => (
          <input
            key={String(field)}
            type="text"
            value={draft[field]}
            onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
            placeholder={placeholders[i]}
            className="min-w-[140px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Adicionar
        </button>
      </div>
    </div>
  );
}
