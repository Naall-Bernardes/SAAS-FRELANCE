"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { BarChart } from "@/components/BarChart";
import { NumberField } from "./NumberField";
import { formatPct, scenarioBadgeVariant } from "./scenario-format";
import { formatCurrency } from "@/lib/format";
import {
  calculateScenarios,
  newCostItemId,
  sumCosts,
  DEFAULT_SCENARIOS,
  IMOVEL_COST_PRESETS,
  VEICULO_COST_PRESETS,
  type CostItem,
  type ScenarioAdjustment,
} from "@/lib/auction-calculator";

type AuctionKind = "imovel" | "veiculo";

const COST_PRESETS: Record<AuctionKind, { label: string; value: number }[]> = {
  imovel: IMOVEL_COST_PRESETS,
  veiculo: VEICULO_COST_PRESETS,
};

const RESALE_VALUE_LABEL: Record<AuctionKind, string> = {
  imovel: "Valor estimado de revenda (mercado)",
  veiculo: "Valor estimado de revenda (FIPE/mercado)",
};

export interface ScenarioCalculatorInitial {
  title?: string;
  purchasePrice: number;
  resaleBaseValue: number;
}

export function ScenarioCalculator({ kind, initial }: { kind: AuctionKind; initial: ScenarioCalculatorInitial }) {
  const [purchasePrice, setPurchasePrice] = useState(initial.purchasePrice);
  const [resaleBaseValue, setResaleBaseValue] = useState(initial.resaleBaseValue);
  const [resaleCommissionPct, setResaleCommissionPct] = useState(6);
  const [holdingMonths, setHoldingMonths] = useState(6);
  const [costs, setCosts] = useState<CostItem[]>(() =>
    COST_PRESETS[kind].map((preset) => ({ id: newCostItemId(), ...preset }))
  );
  const [scenarios, setScenarios] = useState<ScenarioAdjustment[]>(DEFAULT_SCENARIOS);

  const totalCosts = useMemo(() => sumCosts(costs), [costs]);

  const results = useMemo(
    () =>
      calculateScenarios({
        purchasePrice,
        costs,
        resaleBaseValue,
        resaleCommissionPct,
        holdingMonths,
        scenarios,
      }),
    [purchasePrice, costs, resaleBaseValue, resaleCommissionPct, holdingMonths, scenarios]
  );

  function updateCost(id: string, patch: Partial<CostItem>) {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeCost(id: string) {
    setCosts((prev) => prev.filter((c) => c.id !== id));
  }

  function addCost() {
    setCosts((prev) => [...prev, { id: newCostItemId(), label: "Novo custo", value: 0 }]);
  }

  function updateScenarioAdjustment(key: string, adjustmentPct: number) {
    setScenarios((prev) => prev.map((s) => (s.key === key ? { ...s, adjustmentPct } : s)));
  }

  return (
    <div className="space-y-6">
      {initial.title && <p className="text-sm text-muted-foreground">{initial.title}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          label="Valor de arrematação"
          value={purchasePrice}
          onChange={setPurchasePrice}
          hint="O que você efetivamente pagaria pelo lote."
        />
        <NumberField
          label={RESALE_VALUE_LABEL[kind]}
          value={resaleBaseValue}
          onChange={setResaleBaseValue}
          hint="Base do cenário médio — os cenários pessimista/otimista ajustam esse valor."
        />
        <NumberField
          label="Comissão na revenda (%)"
          value={resaleCommissionPct}
          onChange={setResaleCommissionPct}
          hint="Corretagem, plataforma de venda ou anúncio, em % do valor de revenda."
          step={0.5}
        />
        <NumberField
          label="Tempo até a revenda (meses)"
          value={holdingMonths}
          onChange={setHoldingMonths}
          hint="Usado para anualizar o retorno (ROI ao ano)."
          step={1}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Custos para viabilizar a compra</h3>
          <button
            type="button"
            onClick={addCost}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Adicionar custo
          </button>
        </div>
        <div className="space-y-2">
          {costs.map((cost) => (
            <div key={cost.id} className="flex items-center gap-2">
              <input
                type="text"
                value={cost.label}
                onChange={(e) => updateCost(cost.id, { label: e.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <input
                type="number"
                inputMode="decimal"
                value={cost.value || ""}
                placeholder="R$ 0"
                onChange={(e) => updateCost(cost.id, { value: Number(e.target.value) || 0 })}
                className="w-28 shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-right text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="button"
                onClick={() => removeCost(cost.id)}
                aria-label={`Remover custo ${cost.label}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-subtle-foreground hover:bg-surface-hover hover:text-critical"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-right text-sm text-muted-foreground">
          Total de custos: <span className="font-semibold text-foreground">{formatCurrency(totalCosts)}</span>
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Ajuste dos cenários</h3>
        <div className="grid grid-cols-3 gap-2">
          {scenarios.map((s) => (
            <div key={s.key}>
              <label className="mb-1 block text-xs text-subtle-foreground">{s.label}</label>
              <div className="flex items-center rounded-lg border border-border bg-background focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.adjustmentPct}
                  onChange={(e) => updateScenarioAdjustment(s.key, Number(e.target.value) || 0)}
                  className="w-full min-w-0 bg-transparent px-2.5 py-1.5 text-sm text-foreground focus:outline-none"
                />
                <span className="pr-2 text-xs text-subtle-foreground">%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-subtle-foreground">
          Ajuste sobre o valor de revenda estimado — ex: -12% em um leilão de venda mais lenta ou judicial.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Resultado por cenário</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.key} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
                <Badge variant={scenarioBadgeVariant(r.profitable, r.roiPct)}>
                  {r.profitable ? (
                    <TrendingUp className="h-3 w-3" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="h-3 w-3" strokeWidth={2} />
                  )}
                  {formatPct(r.roiPct)} ROI
                </Badge>
              </div>
              <dl className="space-y-1 text-xs">
                <Row label="Valor de revenda" value={formatCurrency(r.resaleValue)} />
                <Row label="Custo total (compra + custos)" value={formatCurrency(r.totalCost)} />
                <Row label="Comissão na revenda" value={formatCurrency(r.resaleCommissionValue)} />
                <Row
                  label="Lucro líquido"
                  value={formatCurrency(r.netProfit)}
                  emphasis
                  negative={r.netProfit < 0}
                />
                <Row
                  label={
                    <Tooltip label="Retorno projetado para 12 meses, considerando o tempo até a revenda informado.">
                      <span className="underline decoration-dotted">ROI anualizado</span>
                    </Tooltip>
                  }
                  value={formatPct(r.roiAnnualizedPct)}
                />
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Comparativo de lucro líquido</h3>
        <BarChart
          data={results.map((r) => ({ label: r.label, value: Math.round(r.netProfit) }))}
          valueFormatter={(v) => formatCurrency(v)}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  emphasis,
  negative,
}: {
  label: React.ReactNode;
  value: string;
  emphasis?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          emphasis
            ? `font-semibold ${negative ? "text-critical" : "text-good"}`
            : "font-medium text-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}

