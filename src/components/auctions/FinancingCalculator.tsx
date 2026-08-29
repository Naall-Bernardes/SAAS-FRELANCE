"use client";

import { useMemo, useState } from "react";
import { CreditCard, Plus, Star, Trash2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { NumberField } from "./NumberField";
import { ProfitProjectionChart } from "./ProfitProjectionChart";
import { formatPct, scenarioBadgeVariant } from "./scenario-format";
import { formatCurrency } from "@/lib/format";
import {
  amortizationSeries,
  analyzeBids,
  calculateFinancingScenarios,
  downPaymentValue as computeDownPaymentValue,
  financedAmount,
  fixedCostsBreakdown,
  makeFlexCost,
  projectProfitOverMonths,
  type CostMode,
  type FinancingInput,
  type FlexCost,
} from "@/lib/auction-financing-calculator";

export interface FinancingCalculatorInitial {
  title?: string;
  marketValue?: number;
  auctionBidValue?: number;
}

export function FinancingCalculator({ initial }: { initial?: FinancingCalculatorInitial }) {
  const [modality, setModality] = useState<"financiado" | "avista">("financiado");
  const [marketValue, setMarketValue] = useState(initial?.marketValue ?? 0);
  const [auctionBidValue, setAuctionBidValue] = useState(initial?.auctionBidValue ?? 0);
  const [downPaymentMode, setDownPaymentMode] = useState<CostMode>("percent");
  const [downPaymentAmount, setDownPaymentAmount] = useState(30);
  const [holdingMonths, setHoldingMonths] = useState(12);
  const [annualInterestRatePct, setAnnualInterestRatePct] = useState(12);
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);
  const [iptu, setIptu] = useState(0);
  const [condominio, setCondominio] = useState(0);
  const [outrasDespesas, setOutrasDespesas] = useState(0);
  const [realEstateCommissionPct, setRealEstateCommissionPct] = useState(6);
  const [renovationCost, setRenovationCost] = useState(0);
  const [lawyerCost, setLawyerCost] = useState<FlexCost>(makeFlexCost(false, "percent", 5));
  const [advisoryCost, setAdvisoryCost] = useState<FlexCost>(makeFlexCost(false, "percent", 3));
  const [vacancyCost, setVacancyCost] = useState<FlexCost>(makeFlexCost(false, "percent", 2));
  const [includeCapitalGainsTax, setIncludeCapitalGainsTax] = useState(false);
  const [itbiPct, setItbiPct] = useState(3);
  const [documentationPct, setDocumentationPct] = useState(5);
  const [auctioneerCommissionPct, setAuctioneerCommissionPct] = useState(5);
  const [customBids, setCustomBids] = useState<number[]>([]);
  const [newBidDraft, setNewBidDraft] = useState("");

  const input: FinancingInput = useMemo(
    () => ({
      modality,
      marketValue,
      auctionBidValue,
      downPaymentMode,
      downPaymentValue: downPaymentAmount,
      holdingMonths,
      annualInterestRatePct,
      monthlyInstallment,
      monthlyExpenses: { iptu, condominio, outras: outrasDespesas },
      realEstateCommissionPct,
      renovationCost,
      lawyerCost,
      advisoryCost,
      vacancyCost,
      includeCapitalGainsTax,
      itbiPct,
      documentationPct,
      auctioneerCommissionPct,
    }),
    [
      modality,
      marketValue,
      auctionBidValue,
      downPaymentMode,
      downPaymentAmount,
      holdingMonths,
      annualInterestRatePct,
      monthlyInstallment,
      iptu,
      condominio,
      outrasDespesas,
      realEstateCommissionPct,
      renovationCost,
      lawyerCost,
      advisoryCost,
      vacancyCost,
      includeCapitalGainsTax,
      itbiPct,
      documentationPct,
      auctioneerCommissionPct,
    ]
  );

  const fixedCosts = useMemo(() => fixedCostsBreakdown(input), [input]);
  const results = useMemo(() => calculateFinancingScenarios(input), [input]);
  const projection = useMemo(
    () => projectProfitOverMonths(input, Math.max(24, holdingMonths)),
    [input, holdingMonths]
  );
  const entrada = computeDownPaymentValue(input);
  const financiado = financedAmount(input);
  const financing = useMemo(
    () => amortizationSeries(input, Math.max(1, holdingMonths)),
    [input, holdingMonths]
  );
  const lastFinancing = financing[financing.length - 1];

  const bidValues = useMemo(() => {
    const base = auctionBidValue > 0 ? auctionBidValue : 100_000;
    const spread = [0.8, 0.9, 1, 1.1, 1.2].map((f) => Math.round((base * f) / 100) * 100);
    const merged = Array.from(new Set([...spread, ...customBids])).filter((v) => v > 0);
    return merged.sort((a, b) => a - b);
  }, [auctionBidValue, customBids]);

  const bidRows = useMemo(() => analyzeBids(input, bidValues), [input, bidValues]);
  const bestBidValue = useMemo(() => {
    if (bidRows.length === 0) return null;
    return bidRows.reduce((best, row) => (row.roiPct > best.roiPct ? row : best), bidRows[0]).bidValue;
  }, [bidRows]);

  function addCustomBid() {
    const value = Number(newBidDraft.replace(/\./g, "").replace(",", "."));
    if (Number.isFinite(value) && value > 0) {
      setCustomBids((prev) => [...prev, value]);
      setNewBidDraft("");
    }
  }

  return (
    <div className="space-y-6">
      {initial?.title && (
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
          Simulação pré-preenchida a partir de <strong>{initial.title}</strong>. Os valores abaixo são só um
          ponto de partida — ajuste como quiser.
        </p>
      )}

      {/* Modalidade */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Modalidade de pagamento</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ModalityCard
            icon={CreditCard}
            label="Arrematação com financiamento"
            hint="Compra com entrada e parcelas mensais"
            active={modality === "financiado"}
            onClick={() => setModality("financiado")}
          />
          <ModalityCard
            icon={Wallet}
            label="Arrematação à vista"
            hint="Paga o lance inteiro na hora"
            active={modality === "avista"}
            onClick={() => setModality("avista")}
          />
        </div>
      </div>

      {/* Valores da simulação */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField label="Valor de mercado" value={marketValue} onChange={setMarketValue} />
        <NumberField label="Valor de arrematação" value={auctionBidValue} onChange={setAuctionBidValue} />
      </div>

      {modality === "financiado" && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Entrada (sinal)</h3>
          <div className="flex items-center gap-2">
            <select
              value={downPaymentMode}
              onChange={(e) => setDownPaymentMode(e.target.value as CostMode)}
              className="rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="percent">Percentual (%)</option>
              <option value="fixed">Valor (R$)</option>
            </select>
            <input
              type="number"
              inputMode="decimal"
              value={downPaymentAmount || ""}
              onChange={(e) => setDownPaymentAmount(Number(e.target.value) || 0)}
              className="w-full min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <p className="mt-1.5 text-xs text-subtle-foreground">
            Entrada: <strong className="text-foreground">{formatCurrency(entrada)}</strong> · Valor financiado:{" "}
            <strong className="text-foreground">{formatCurrency(financiado)}</strong>
          </p>
        </div>
      )}

      <NumberField
        label="Meses até a revenda"
        value={holdingMonths}
        onChange={(v) => setHoldingMonths(Math.max(1, v))}
        step={1}
        hint="Tempo que pretende manter o imóvel antes de vender — usado pra projetar juros, despesas mensais e ROI anualizado."
      />

      {modality === "financiado" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            label="Taxa de juros ao ano"
            value={annualInterestRatePct}
            onChange={setAnnualInterestRatePct}
            step={0.5}
            suffix="%"
          />
          <NumberField
            label="Valor da parcela mensal"
            value={monthlyInstallment}
            onChange={setMonthlyInstallment}
          />
        </div>
      )}

      {/* Despesas mensais */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Despesas mensais</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumberField label="IPTU mensal" value={iptu} onChange={setIptu} />
          <NumberField label="Condomínio mensal" value={condominio} onChange={setCondominio} />
          <NumberField label="Outras despesas mensais" value={outrasDespesas} onChange={setOutrasDespesas} />
        </div>
      </div>

      {/* Despesas e custos */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Despesas e custos</h3>
        <div className="space-y-3 rounded-xl border border-border bg-background p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              label="Comissão imobiliária (na venda)"
              value={realEstateCommissionPct}
              onChange={setRealEstateCommissionPct}
              step={0.5}
              suffix="%"
            />
            <NumberField label="Custo de reforma" value={renovationCost} onChange={setRenovationCost} />
          </div>

          <FlexCostRow label="Custo com advogado" cost={lawyerCost} onChange={setLawyerCost} />
          <FlexCostRow label="Comissão de assessoria" cost={advisoryCost} onChange={setAdvisoryCost} />
          <FlexCostRow label="Custo de desocupação" cost={vacancyCost} onChange={setVacancyCost} />

          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={includeCapitalGainsTax}
              onChange={(e) => setIncludeCapitalGainsTax(e.target.checked)}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            Incluir imposto sobre ganho de capital (15% sobre venda − arrematação)
          </label>
        </div>
      </div>

      {/* Custos fixos automáticos */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Custos fixos (sobre o valor de arrematação)</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle-foreground">
                <th className="px-3 py-2 font-semibold">Despesa</th>
                <th className="px-3 py-2 font-semibold">%</th>
                <th className="px-3 py-2 text-right font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody>
              <FixedCostTableRow label="ITBI" pct={itbiPct} onChange={setItbiPct} value={fixedCosts.itbi} />
              <FixedCostTableRow
                label="Documentação"
                pct={documentationPct}
                onChange={setDocumentationPct}
                value={fixedCosts.documentation}
              />
              <FixedCostTableRow
                label="Comissão do leiloeiro"
                pct={auctioneerCommissionPct}
                onChange={setAuctioneerCommissionPct}
                value={fixedCosts.auctioneerCommission}
              />
              <tr className="border-t border-border bg-surface-hover font-semibold text-foreground">
                <td className="px-3 py-2">Subtotal custos fixos</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2 text-right">{formatCurrency(fixedCosts.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Resultado por cenário */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Resultado por cenário</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.key} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{r.label}</span>
                <Badge variant={scenarioBadgeVariant(r.profitable, r.roiPct)}>{formatPct(r.roiPct)} ROI</Badge>
              </div>
              <dl className="space-y-1 text-xs">
                <Row label="Valor de venda" value={formatCurrency(r.saleValue)} />
                {modality === "financiado" && (
                  <Row label="Saldo devedor restante" value={formatCurrency(r.outstandingBalance)} />
                )}
                <Row label="Comissão imobiliária" value={formatCurrency(r.realEstateCommissionValue)} />
                {includeCapitalGainsTax && (
                  <Row label="Imposto ganho de capital" value={formatCurrency(r.capitalGainsTaxValue)} />
                )}
                <Row label="Total investido" value={formatCurrency(r.totalInvested)} />
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
        {modality === "financiado" && lastFinancing && (
          <p className="mt-2 text-xs text-subtle-foreground">
            Em {holdingMonths} meses: {formatCurrency(lastFinancing.cumulativePaid)} pagos em parcelas, dos quais{" "}
            {formatCurrency(lastFinancing.cumulativeInterest)} em juros.
          </p>
        )}
      </div>

      {/* Gráfico de projeção */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Lucro líquido projetado ao longo do tempo</h3>
        <ProfitProjectionChart data={projection} highlightMonth={holdingMonths} />
      </div>

      {/* Análise de múltiplos lances */}
      <div>
        <h3 className="mb-1 text-sm font-semibold text-foreground">Análise de múltiplos lances</h3>
        <p className="mb-2 text-xs text-subtle-foreground">
          Mesma simulação (cenário médio) recalculada para diferentes valores de lance — ajuda a decidir até quanto
          vale a pena disputar.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle-foreground">
                <th className="px-3 py-2 font-semibold">Lance</th>
                <th className="px-3 py-2 text-right font-semibold">Total investido</th>
                <th className="px-3 py-2 text-right font-semibold">Lucro líquido</th>
                <th className="px-3 py-2 text-right font-semibold">ROI</th>
                <th className="px-3 py-2 text-right font-semibold" />
              </tr>
            </thead>
            <tbody>
              {bidRows.map((row) => (
                <tr key={row.bidValue} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">
                    {row.bidValue === bestBidValue && (
                      <Star className="mr-1 inline h-3.5 w-3.5 fill-warning text-warning" strokeWidth={1.5} />
                    )}
                    {formatCurrency(row.bidValue)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(row.totalInvested)}</td>
                  <td className={`px-3 py-2 text-right font-medium ${row.netProfit < 0 ? "text-critical" : "text-good"}`}>
                    {formatCurrency(row.netProfit)}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{formatPct(row.roiPct)}</td>
                  <td className="px-3 py-2 text-right">
                    {customBids.includes(row.bidValue) && (
                      <button
                        type="button"
                        onClick={() => setCustomBids((prev) => prev.filter((v) => v !== row.bidValue))}
                        aria-label={`Remover lance de ${formatCurrency(row.bidValue)}`}
                        className="text-subtle-foreground hover:text-critical"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Adicionar lance personalizado (R$)"
            value={newBidDraft}
            onChange={(e) => setNewBidDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomBid()}
            className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="button"
            onClick={addCustomBid}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-hover"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalityCard({
  icon: Icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: typeof CreditCard;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        active ? "border-accent bg-accent-soft" : "border-border bg-background hover:bg-surface-hover"
      }`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-accent" : "text-subtle-foreground"}`} strokeWidth={1.75} />
      <span>
        <span className={`block text-sm font-medium ${active ? "text-accent" : "text-foreground"}`}>{label}</span>
        <span className="block text-xs text-subtle-foreground">{hint}</span>
      </span>
    </button>
  );
}

function FlexCostRow({ label, cost, onChange }: { label: string; cost: FlexCost; onChange: (c: FlexCost) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex min-w-[220px] flex-1 cursor-pointer items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={cost.enabled}
          onChange={(e) => onChange({ ...cost, enabled: e.target.checked })}
          className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
        />
        {label}
      </label>
      <select
        value={cost.mode}
        disabled={!cost.enabled}
        onChange={(e) => onChange({ ...cost, mode: e.target.value as CostMode })}
        className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground disabled:opacity-50"
      >
        <option value="percent">%</option>
        <option value="fixed">R$</option>
      </select>
      <input
        type="number"
        inputMode="decimal"
        disabled={!cost.enabled}
        value={cost.value || ""}
        onChange={(e) => onChange({ ...cost, value: Number(e.target.value) || 0 })}
        className="w-28 rounded-lg border border-border bg-background px-2.5 py-1.5 text-right text-sm text-foreground disabled:opacity-50"
      />
    </div>
  );
}

function FixedCostTableRow({
  label,
  pct,
  onChange,
  value,
}: {
  label: string;
  pct: number;
  onChange: (v: number) => void;
  value: number;
}) {
  return (
    <tr className="border-b border-border">
      <td className="px-3 py-2 text-foreground">{label}</td>
      <td className="px-3 py-2">
        <input
          type="number"
          inputMode="decimal"
          step={0.5}
          value={pct || ""}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
        />
      </td>
      <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(value)}</td>
    </tr>
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
      <dd className={emphasis ? `font-semibold ${negative ? "text-critical" : "text-good"}` : "font-medium text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
