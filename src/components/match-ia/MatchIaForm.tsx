"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Sparkles, X } from "lucide-react";
import { TagInput } from "@/components/ui/TagInput";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { PLATFORMS } from "@/lib/demo-opportunities";
import {
  DEFAULT_MATCH_PROFILE,
  INTERESTS,
  STRATEGIES,
  type MatchProfile,
  type MatchStrategy,
  type SkillLevel,
} from "@/lib/match-profile";

const SKILL_LEVELS: SkillLevel[] = ["Iniciante", "Intermediário", "Avançado"];

export function MatchIaForm() {
  const [profile, setProfile] = useLocalStorageState<MatchProfile>(
    "saas-frelance:match-profile",
    DEFAULT_MATCH_PROFILE
  );
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("Intermediário");
  const [justUpdated, setJustUpdated] = useState(false);

  function addSkill() {
    const name = newSkillName.trim();
    if (!name) return;
    setProfile((p) => ({ ...p, skills: [...p.skills, { name, level: newSkillLevel }] }));
    setNewSkillName("");
  }

  function removeSkill(name: string) {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s.name !== name) }));
  }

  function toggleInterest(interest: string) {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(interest) ? p.interests.filter((i) => i !== interest) : [...p.interests, interest],
    }));
  }

  function togglePlatform(platform: string) {
    setProfile((p) => ({
      ...p,
      preferredPlatforms: p.preferredPlatforms.includes(platform)
        ? p.preferredPlatforms.filter((pl) => pl !== platform)
        : [...p.preferredPlatforms, platform],
    }));
  }

  function updateModel() {
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3000);
  }

  return (
    <div className="space-y-6">
      <Section title="Minhas habilidades" description="Isso define o peso de compatibilidade técnica no Match IA.">
        <div className="space-y-2">
          {profile.skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2"
            >
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{skill.level}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.name)}
                  aria-label={`Remover ${skill.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded text-subtle-foreground hover:bg-surface-hover hover:text-critical"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="Nova habilidade"
            className="min-w-[160px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {SKILL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addSkill}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Adicionar
          </button>
        </div>
      </Section>

      <Section title="Tenho interesse em">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <label
              key={interest}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                profile.interests.includes(interest)
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              <input
                type="checkbox"
                checked={profile.interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
                className="sr-only"
              />
              {interest}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Não tenho interesse em" description="Categorias ou palavras-chave que a IA deve evitar.">
        <TagInput
          value={profile.negativeKeywords}
          onChange={(negativeKeywords) => setProfile((p) => ({ ...p, negativeKeywords }))}
          placeholder="Ex: criptomoeda, apostas..."
        />
      </Section>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Section title="Valor mínimo de projeto (R$)">
          <input
            type="number"
            value={profile.minProjectValue ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, minProjectValue: e.target.value ? Number(e.target.value) : undefined }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
        <Section title="Valor/hora mínimo (R$)">
          <input
            type="number"
            value={profile.minHourlyValue ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, minHourlyValue: e.target.value ? Number(e.target.value) : undefined }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Section title="Idiomas">
          <TagInput value={profile.languages} onChange={(languages) => setProfile((p) => ({ ...p, languages }))} />
        </Section>
        <Section title="Disponibilidade semanal (horas)">
          <input
            type="number"
            value={profile.weeklyAvailability ?? ""}
            onChange={(e) =>
              setProfile((p) => ({ ...p, weeklyAvailability: e.target.value ? Number(e.target.value) : undefined }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </Section>
      </div>

      <Section title="Plataformas preferidas">
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                profile.preferredPlatforms.includes(platform)
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              <input
                type="checkbox"
                checked={profile.preferredPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="sr-only"
              />
              {platform}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Estratégia de busca">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STRATEGIES.map((s) => (
            <button
              type="button"
              key={s.value}
              onClick={() => setProfile((p) => ({ ...p, strategy: s.value as MatchStrategy }))}
              className={`rounded-xl border p-4 text-left transition-colors ${
                profile.strategy === s.value
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-background hover:bg-surface-hover"
              }`}
            >
              <p className={`text-sm font-semibold ${profile.strategy === s.value ? "text-accent" : "text-foreground"}`}>
                {s.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
            </button>
          ))}
        </div>
      </Section>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={updateModel}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" strokeWidth={2} />
          Atualizar modelo de Match
        </button>
        {justUpdated && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-good">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            Preferências salvas
          </span>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}
