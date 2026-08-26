"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Meter } from "@/components/ui/Meter";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { SEED_ALERTS } from "@/lib/alerts";
import { SEED_SEARCHES } from "@/lib/searches";
import { BILLING_HISTORY, PLAN_TIERS } from "@/lib/plans";

export function PlanBoard() {
  const [planKey, setPlanKey] = useLocalStorageState<string>("saas-frelance:plan", "pro");
  const currentPlan = PLAN_TIERS.find((p) => p.key === planKey) ?? PLAN_TIERS[1];

  const searchesUsed = SEED_SEARCHES.length;
  const alertsUsed = SEED_ALERTS.length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Plano atual</p>
            <p className="text-xl font-semibold text-foreground">
              {currentPlan.name} · {currentPlan.price}
              <span className="text-sm font-normal text-muted-foreground">{currentPlan.cadence}</span>
            </p>
          </div>
          <Badge variant="good">Ativo</Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <UsageBar label="Buscas ativas" used={searchesUsed} limit={currentPlan.searchLimit} />
          <UsageBar label="Alertas configurados" used={alertsUsed} limit={currentPlan.alertLimit} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Planos disponíveis</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PLAN_TIERS.map((tier) => {
            const isCurrent = tier.key === planKey;
            return (
              <div
                key={tier.key}
                className={`flex flex-col rounded-2xl border p-5 ${
                  isCurrent ? "border-accent bg-accent-soft" : "border-border bg-surface"
                }`}
              >
                <p className="font-semibold text-foreground">{tier.name}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {tier.price}
                  <span className="text-sm font-normal text-muted-foreground">{tier.cadence}</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good" strokeWidth={1.75} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => setPlanKey(tier.key)}
                  className={`mt-5 rounded-lg px-4 py-2 text-sm font-medium ${
                    isCurrent
                      ? "cursor-default bg-surface-hover text-muted-foreground"
                      : "bg-accent text-accent-foreground hover:opacity-90"
                  }`}
                >
                  {isCurrent ? "Plano atual" : "Selecionar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Histórico de cobrança</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-subtle-foreground">
              <th scope="col" className="pb-2 font-medium">Data</th>
              <th scope="col" className="pb-2 font-medium">Descrição</th>
              <th scope="col" className="pb-2 text-right font-medium">Valor</th>
              <th scope="col" className="pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {BILLING_HISTORY.map((entry, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2 text-muted-foreground">{entry.date}</td>
                <td className="py-2 text-foreground">{entry.description}</td>
                <td className="py-2 text-right font-medium text-foreground">R$ {entry.amount}</td>
                <td className="py-2 text-right">
                  <Badge variant={entry.status === "Pago" ? "good" : "warning"}>{entry.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const unlimited = limit >= 999;
  const pct = unlimited ? 100 : Math.min(100, (used / limit) * 100);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{unlimited ? `${used} · ilimitado` : `${used} / ${limit}`}</span>
      </div>
      <Meter value={pct} colorVar={pct >= 90 && !unlimited ? "--critical" : "--accent"} />
    </div>
  );
}
