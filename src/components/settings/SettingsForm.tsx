"use client";

import { CHANNEL_LABELS } from "@/lib/alerts";
import { Switch } from "@/components/ui/Switch";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { DEFAULT_SETTINGS, LANGUAGES, TIMEZONES, type Settings } from "@/lib/settings";

export function SettingsForm() {
  const [settings, setSettings] = useLocalStorageState<Settings>("saas-frelance:settings", DEFAULT_SETTINGS);

  function toggleNotification(channel: keyof Settings["notifications"]) {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [channel]: !s.notifications[channel] } }));
  }

  function togglePrivacy(key: keyof Settings["privacy"]) {
    setSettings((s) => ({ ...s, privacy: { ...s.privacy, [key]: !s.privacy[key] } }));
  }

  return (
    <div className="space-y-6">
      <Section title="Notificações" description="Canais padrão usados por alertas e resumos.">
        <div className="space-y-3">
          {(Object.keys(settings.notifications) as (keyof Settings["notifications"])[]).map((channel) => (
            <div key={channel} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{CHANNEL_LABELS[channel]}</span>
              <Switch checked={settings.notifications[channel]} onChange={() => toggleNotification(channel)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Idioma e fuso horário">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
              Fuso horário
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings((s) => ({ ...s, timezone: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {TIMEZONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Privacidade">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Perfil público (visível pra outros usuários)</span>
            <Switch checked={settings.privacy.profilePublic} onChange={() => togglePrivacy("profilePublic")} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Compartilhar dados de uso para melhorar o produto</span>
            <Switch checked={settings.privacy.shareUsageData} onChange={() => togglePrivacy("shareUsageData")} />
          </div>
        </div>
      </Section>

      <Section title="Conta">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
            E-mail da conta
          </label>
          <input
            type="email"
            value={settings.accountEmail}
            onChange={(e) => setSettings((s) => ({ ...s, accountEmail: e.target.value }))}
            placeholder="seu@email.com"
            className="w-full max-w-sm rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </Section>
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
