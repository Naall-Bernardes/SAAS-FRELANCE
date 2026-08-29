"use client";

import { useState } from "react";
import { Calculator, ExternalLink, Gauge, Key, KeyRound, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import type { DemoVeiculo } from "@/lib/demo-auctions";
import { AuctionCalculatorModal } from "./AuctionCalculatorModal";

const ORIGIN_VARIANT = {
  "Recuperado de Financiamento": "warning",
  "Recuperado de Seguradora": "critical",
  Particular: "neutral",
  Leiloshop: "accent",
} as const;

export function VeiculoCard({ veiculo }: { veiculo: DemoVeiculo }) {
  const [calcOpen, setCalcOpen] = useState(false);
  const discountPct = Math.round((1 - veiculo.currentBidValue / veiculo.fipeValue) * 100);
  const auctionDateLabel = veiculo.auctionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{veiculo.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {veiculo.city} – {veiculo.state}
          </p>
        </div>
        <Badge variant="hot" className="shrink-0">
          -{discountPct}% vs. FIPE
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{veiculo.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <Badge variant={ORIGIN_VARIANT[veiculo.origin]}>{veiculo.origin}</Badge>
        <span>{veiculo.category}</span>
        <span>Ano {veiculo.year}</span>
        <span className="inline-flex items-center gap-1">
          <Gauge className="h-3.5 w-3.5" strokeWidth={1.75} />
          {veiculo.km.toLocaleString("pt-BR")} km
        </span>
        <span className="inline-flex items-center gap-1">
          {veiculo.hasKey ? (
            <Key className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <KeyRound className="h-3.5 w-3.5 opacity-50" strokeWidth={1.75} />
          )}
          {veiculo.hasKey ? "Com chave" : "Sem chave"}
        </span>
        <span>Leilão em {auctionDateLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
        <Metric label="Tabela FIPE" value={formatCurrency(veiculo.fipeValue)} />
        <Metric label="Lance atual" value={formatCurrency(veiculo.currentBidValue)} emphasis />
        <Metric label="Fotos" value={`${veiculo.photosCount}`} />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={veiculo.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Ver lote
        </a>
        <button
          type="button"
          onClick={() => setCalcOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Calculator className="h-3.5 w-3.5" strokeWidth={1.75} />
          Calcular rentabilidade
        </button>
      </div>

      <AuctionCalculatorModal
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        kind="veiculo"
        initial={{
          title: veiculo.title,
          purchasePrice: veiculo.currentBidValue,
          resaleBaseValue: veiculo.fipeValue,
        }}
      />
    </div>
  );
}

function Metric({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-subtle-foreground">{label}</span>
      <span className={emphasis ? "text-sm font-semibold text-foreground" : "text-sm font-medium text-foreground"}>
        {value}
      </span>
    </div>
  );
}
