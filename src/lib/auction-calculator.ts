/**
 * Motor de cálculo de rentabilidade para oportunidades de leilão (imóveis e
 * veículos). Recebe o valor de arrematação, uma lista livre de custos
 * adicionais (reforma, advogado/imissão de posse, documentação, reparo
 * mecânico...) e uma estimativa de valor de revenda, e devolve três
 * cenários — pessimista, médio e otimista — com lucro líquido e ROI.
 */

export interface CostItem {
  id: string;
  label: string;
  value: number;
}

export interface ScenarioAdjustment {
  key: string;
  label: string;
  /** ajuste percentual aplicado sobre o valor de revenda base neste cenário */
  adjustmentPct: number;
}

export interface CalculatorInput {
  /** valor do lance de arrematação (o que efetivamente será pago pelo bem) */
  purchasePrice: number;
  /** custos adicionais para viabilizar a compra/revenda (um item por linha) */
  costs: CostItem[];
  /** valor de revenda estimado no cenário médio (mercado/FIPE/avaliação) */
  resaleBaseValue: number;
  /** comissão de corretagem/plataforma cobrada na revenda, em % do valor de revenda */
  resaleCommissionPct: number;
  /** tempo estimado até a revenda, em meses (usado para anualizar o ROI) */
  holdingMonths: number;
  scenarios?: ScenarioAdjustment[];
}

export interface ScenarioResult {
  key: string;
  label: string;
  resaleValue: number;
  totalCost: number;
  resaleCommissionValue: number;
  netProfit: number;
  roiPct: number;
  roiAnnualizedPct: number;
  profitable: boolean;
}

export const DEFAULT_SCENARIOS: ScenarioAdjustment[] = [
  { key: "pessimista", label: "Pessimista", adjustmentPct: -12 },
  { key: "medio", label: "Médio", adjustmentPct: 0 },
  { key: "otimista", label: "Otimista", adjustmentPct: 12 },
];

export function sumCosts(costs: CostItem[]): number {
  return costs.reduce((total, item) => total + (Number.isFinite(item.value) ? item.value : 0), 0);
}

export function calculateScenarios(input: CalculatorInput): ScenarioResult[] {
  const scenarios = input.scenarios ?? DEFAULT_SCENARIOS;
  const totalCost = Math.max(0, input.purchasePrice) + sumCosts(input.costs);
  const holdingMonths = input.holdingMonths > 0 ? input.holdingMonths : 1;

  return scenarios.map((scenario) => {
    const resaleValue = Math.max(0, input.resaleBaseValue * (1 + scenario.adjustmentPct / 100));
    const resaleCommissionValue = resaleValue * (input.resaleCommissionPct / 100);
    const netProfit = resaleValue - resaleCommissionValue - totalCost;
    const roiPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const roiAnnualizedPct = (Math.pow(1 + roiPct / 100, 12 / holdingMonths) - 1) * 100;

    return {
      key: scenario.key,
      label: scenario.label,
      resaleValue,
      totalCost,
      resaleCommissionValue,
      netProfit,
      roiPct,
      roiAnnualizedPct: Number.isFinite(roiAnnualizedPct) ? roiAnnualizedPct : 0,
      profitable: netProfit >= 0,
    };
  });
}

let idCounter = 0;
export function newCostItemId(): string {
  idCounter += 1;
  return `cost-${Date.now()}-${idCounter}`;
}

/** Presets de custos típicos por tipo de leilão — ponto de partida editável pelo usuário. */
export const IMOVEL_COST_PRESETS: Omit<CostItem, "id">[] = [
  { label: "Comissão do leiloeiro (5%)", value: 0 },
  { label: "ITBI + registro em cartório", value: 0 },
  { label: "Reforma / reparos", value: 0 },
  { label: "Advogado (imissão na posse / desocupação)", value: 0 },
  { label: "IPTU e condomínio em atraso", value: 0 },
];

export const VEICULO_COST_PRESETS: Omit<CostItem, "id">[] = [
  { label: "Comissão do leiloeiro (5%)", value: 0 },
  { label: "Documentação e transferência", value: 0 },
  { label: "Reparo mecânico / funilaria", value: 0 },
  { label: "Multas e débitos (IPVA/licenciamento)", value: 0 },
  { label: "Guincho / transporte", value: 0 },
];
