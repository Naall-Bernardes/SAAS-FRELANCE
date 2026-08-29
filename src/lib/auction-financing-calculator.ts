/**
 * Motor de cálculo da Calculadora de Financiamento de leilão de imóveis.
 *
 * Inspirado nos campos da calculadora pública leilaocomcredito.com.br
 * (modalidade à vista/financiado, entrada, parcela, despesas mensais,
 * comissão do leiloeiro, ITBI, documentação, reforma, advogado, assessoria,
 * desocupação, imposto sobre ganho de capital, análise de múltiplos lances e
 * gráfico de lucro ao longo do tempo) — mas com uma amortização e um cálculo
 * de lucro escritos do zero aqui (sem casas onde custo de venda é contado
 * duas vezes) e, principalmente, com os 3 cenários (pessimista/médio/
 * otimista) do resto do módulo Leilões, em vez de uma única projeção fixa.
 */

import { DEFAULT_SCENARIOS, type ScenarioAdjustment } from "./auction-calculator";

export type CostMode = "percent" | "fixed";

export interface FlexCost {
  enabled: boolean;
  mode: CostMode;
  /** percentual (0-100) se mode="percent", valor em R$ se mode="fixed" */
  value: number;
}

export interface MonthlyExpenses {
  iptu: number;
  condominio: number;
  outras: number;
}

export interface FinancingInput {
  modality: "financiado" | "avista";
  /** valor de mercado — usado como base de venda do cenário médio */
  marketValue: number;
  /** valor de arrematação (o lance vencedor) */
  auctionBidValue: number;
  downPaymentMode: CostMode;
  downPaymentValue: number;
  /** tempo estimado até a revenda, em meses */
  holdingMonths: number;
  annualInterestRatePct: number;
  monthlyInstallment: number;
  monthlyExpenses: MonthlyExpenses;
  realEstateCommissionPct: number;
  renovationCost: number;
  lawyerCost: FlexCost;
  advisoryCost: FlexCost;
  vacancyCost: FlexCost;
  includeCapitalGainsTax: boolean;
  itbiPct: number;
  documentationPct: number;
  auctioneerCommissionPct: number;
  scenarios?: ScenarioAdjustment[];
}

export interface AmortizationPoint {
  month: number;
  balance: number;
  cumulativePaid: number;
  cumulativeInterest: number;
}

export interface FinancingScenarioResult {
  key: string;
  label: string;
  saleValue: number;
  outstandingBalance: number;
  realEstateCommissionValue: number;
  capitalGainsTaxValue: number;
  totalInvested: number;
  netProfit: number;
  roiPct: number;
  roiAnnualizedPct: number;
  profitable: boolean;
}

export interface FixedCostsBreakdown {
  itbi: number;
  documentation: number;
  auctioneerCommission: number;
  renovation: number;
  lawyer: number;
  advisory: number;
  vacancy: number;
  total: number;
}

export function makeFlexCost(enabled = false, mode: CostMode = "percent", value = 0): FlexCost {
  return { enabled, mode, value };
}

function resolveFlexCost(cost: FlexCost, base: number): number {
  if (!cost.enabled) return 0;
  return cost.mode === "percent" ? base * (cost.value / 100) : cost.value;
}

export function downPaymentValue(input: FinancingInput): number {
  if (input.modality === "avista") return input.auctionBidValue;
  return input.downPaymentMode === "percent"
    ? input.auctionBidValue * (input.downPaymentValue / 100)
    : input.downPaymentValue;
}

export function financedAmount(input: FinancingInput): number {
  if (input.modality === "avista") return 0;
  return Math.max(0, input.auctionBidValue - downPaymentValue(input));
}

export function fixedCostsBreakdown(input: FinancingInput): FixedCostsBreakdown {
  const itbi = input.auctionBidValue * (input.itbiPct / 100);
  const documentation = input.auctionBidValue * (input.documentationPct / 100);
  const auctioneerCommission = input.auctionBidValue * (input.auctioneerCommissionPct / 100);
  const renovation = input.renovationCost;
  const lawyer = resolveFlexCost(input.lawyerCost, input.auctionBidValue);
  const advisory = resolveFlexCost(input.advisoryCost, input.auctionBidValue);
  const vacancy = resolveFlexCost(input.vacancyCost, input.auctionBidValue);

  return {
    itbi,
    documentation,
    auctioneerCommission,
    renovation,
    lawyer,
    advisory,
    vacancy,
    total: itbi + documentation + auctioneerCommission + renovation + lawyer + advisory + vacancy,
  };
}

/** Amortização mês a mês: parcela fixa, juros sobre o saldo devedor (SAC/Price simplificado). */
export function amortizationSeries(input: FinancingInput, months: number): AmortizationPoint[] {
  const points: AmortizationPoint[] = [];
  if (input.modality === "avista") {
    for (let m = 1; m <= months; m++) {
      points.push({ month: m, balance: 0, cumulativePaid: 0, cumulativeInterest: 0 });
    }
    return points;
  }

  const monthlyRate = input.annualInterestRatePct / 100 / 12;
  let balance = financedAmount(input);
  let cumulativePaid = 0;
  let cumulativeInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    const amortization = Math.min(balance, Math.max(0, input.monthlyInstallment - interest));
    balance = Math.max(0, balance - amortization);
    cumulativePaid += input.monthlyInstallment;
    cumulativeInterest += interest;
    points.push({ month: m, balance, cumulativePaid, cumulativeInterest });
  }

  return points;
}

function monthlyExpensesTotal(input: FinancingInput, months: number): number {
  const { iptu, condominio, outras } = input.monthlyExpenses;
  return (iptu + condominio + outras) * months;
}

/** Total investido até `months`, sem contar comissão/imposto de venda (que dependem do cenário). */
function totalInvestedUntil(input: FinancingInput, months: number): number {
  const fixed = fixedCostsBreakdown(input).total;
  const upfront = downPaymentValue(input);
  const financing = amortizationSeries(input, months);
  const paid = financing[financing.length - 1]?.cumulativePaid ?? 0;
  return upfront + fixed + monthlyExpensesTotal(input, months) + paid;
}

export function calculateFinancingScenarios(input: FinancingInput): FinancingScenarioResult[] {
  const scenarios = input.scenarios ?? DEFAULT_SCENARIOS;
  const months = Math.max(1, input.holdingMonths);
  const totalInvested = totalInvestedUntil(input, months);
  const financing = amortizationSeries(input, months);
  const outstandingBalance = financing[financing.length - 1]?.balance ?? 0;

  return scenarios.map((scenario) => {
    const saleValue = Math.max(0, input.marketValue * (1 + scenario.adjustmentPct / 100));
    const realEstateCommissionValue = saleValue * (input.realEstateCommissionPct / 100);
    const capitalGainsTaxValue = input.includeCapitalGainsTax
      ? Math.max(0, saleValue - input.auctionBidValue) * 0.15
      : 0;

    const netProceeds = saleValue - realEstateCommissionValue - capitalGainsTaxValue - outstandingBalance;
    const netProfit = netProceeds - totalInvested;
    const roiPct = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
    const roiAnnualizedPct = (Math.pow(1 + roiPct / 100, 12 / months) - 1) * 100;

    return {
      key: scenario.key,
      label: scenario.label,
      saleValue,
      outstandingBalance,
      realEstateCommissionValue,
      capitalGainsTaxValue,
      totalInvested,
      netProfit,
      roiPct,
      roiAnnualizedPct: Number.isFinite(roiAnnualizedPct) ? roiAnnualizedPct : 0,
      profitable: netProfit >= 0,
    };
  });
}

export interface MonthlyProfitProjectionPoint {
  month: number;
  profitByScenario: Record<string, number>;
}

/** Lucro líquido projetado mês a mês (até `maxMonths`) para cada cenário — alimenta o gráfico. */
export function projectProfitOverMonths(input: FinancingInput, maxMonths = 24): MonthlyProfitProjectionPoint[] {
  const scenarios = input.scenarios ?? DEFAULT_SCENARIOS;
  const points: MonthlyProfitProjectionPoint[] = [];

  for (let m = 1; m <= maxMonths; m++) {
    const totalInvested = totalInvestedUntil(input, m);
    const financing = amortizationSeries(input, m);
    const outstandingBalance = financing[financing.length - 1]?.balance ?? 0;

    const profitByScenario: Record<string, number> = {};
    for (const scenario of scenarios) {
      const saleValue = Math.max(0, input.marketValue * (1 + scenario.adjustmentPct / 100));
      const realEstateCommissionValue = saleValue * (input.realEstateCommissionPct / 100);
      const capitalGainsTaxValue = input.includeCapitalGainsTax
        ? Math.max(0, saleValue - input.auctionBidValue) * 0.15
        : 0;
      const netProceeds = saleValue - realEstateCommissionValue - capitalGainsTaxValue - outstandingBalance;
      profitByScenario[scenario.key] = netProceeds - totalInvested;
    }

    points.push({ month: m, profitByScenario });
  }

  return points;
}

export interface BidAnalysisRow {
  bidValue: number;
  totalInvested: number;
  netProfit: number;
  roiPct: number;
}

/**
 * Recalcula o resultado (cenário médio) para uma lista de lances hipotéticos,
 * mantendo todos os outros parâmetros fixos — útil pra decidir até quanto vale
 * a pena dar lance. Espelha a "Análise de Múltiplos Lances" da referência.
 */
export function analyzeBids(input: FinancingInput, bidValues: number[]): BidAnalysisRow[] {
  const medio = (input.scenarios ?? DEFAULT_SCENARIOS).find((s) => s.key === "medio") ?? DEFAULT_SCENARIOS[1];

  return bidValues.map((bidValue) => {
    const scenarioInput: FinancingInput = { ...input, auctionBidValue: bidValue, scenarios: [medio] };
    const [result] = calculateFinancingScenarios(scenarioInput);
    return {
      bidValue,
      totalInvested: result.totalInvested,
      netProfit: result.netProfit,
      roiPct: result.roiPct,
    };
  });
}
