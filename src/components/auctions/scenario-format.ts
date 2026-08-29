import type { BadgeVariant } from "@/components/ui/Badge";

/** Formata um percentual de ROI/deságio com 1 casa decimal — ex: 12.3%. */
export function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Cor do badge de um cenário — vermelho se dá prejuízo, âmbar se o ROI é baixo, verde caso contrário. */
export function scenarioBadgeVariant(profitable: boolean, roiPct: number): BadgeVariant {
  if (!profitable) return "critical";
  if (roiPct < 12) return "warning";
  return "good";
}
