"use client";

import { Briefcase, Mail, MessageCircle, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { DEFAULT_CONNECTED, INTEGRATIONS } from "@/lib/integrations";

const ICONS: Record<string, LucideIcon> = {
  gmail: Mail,
  whatsapp: MessageCircle,
  telegram: Send,
};

export function IntegrationsBoard() {
  const [connected, setConnected] = useLocalStorageState<Record<string, boolean>>(
    "saas-frelance:integrations",
    DEFAULT_CONNECTED
  );

  function toggle(key: string) {
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const groups = ["Plataformas de freelance", "Notificações"] as const;

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group}>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{group}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.filter((i) => i.group === group).map((integration) => {
              const isConnected = !!connected[integration.key];
              const Icon = ICONS[integration.key] ?? Briefcase;
              return (
                <div key={integration.key} className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-hover text-muted-foreground">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        isConnected ? "text-good" : "text-subtle-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-good" : "bg-subtle-foreground"}`}
                      />
                      {isConnected ? "Conectado" : "Não conectado"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(integration.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        isConnected
                          ? "border border-border text-foreground hover:bg-surface-hover"
                          : "bg-accent text-accent-foreground hover:opacity-90"
                      }`}
                    >
                      {isConnected ? "Desconectar" : "Conectar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
