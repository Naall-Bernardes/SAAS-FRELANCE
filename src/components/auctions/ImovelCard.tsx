"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ExternalLink, Landmark, Lock, MapPin, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import type { DemoImovel } from "@/lib/demo-auctions";
import { AuctionCalculatorModal } from "./AuctionCalculatorModal";

export function ImovelCard({ imovel }: { imovel: DemoImovel }) {
  const [calcOpen, setCalcOpen] = useState(false);
  const auctionDateLabel = imovel.auctionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{imovel.title}</h3>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            {imovel.neighborhood}, {imovel.city} – {imovel.state}
          </p>
        </div>
        <Badge variant="hot" className="shrink-0">
          -{Math.round(imovel.discountPct)}% vs. avaliação
        </Badge>
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{imovel.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <Badge variant="neutral">{imovel.category}</Badge>
        <span>{imovel.areaM2} m²</span>
        {imovel.bedrooms && <span>{imovel.bedrooms} quartos</span>}
        <span className="inline-flex items-center gap-1">
          {imovel.occupied ? (
            <Lock className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Unlock className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          {imovel.occupied ? "Ocupado" : "Desocupado"}
        </span>
        <span>Leilão em {auctionDateLabel}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
        <Metric label="Avaliação" value={formatCurrency(imovel.evaluationValue)} />
        <Metric label="1º lance / valor mín." value={formatCurrency(imovel.firstBidValue)} emphasis />
        {imovel.secondBidValue && <Metric label="2ª praça" value={formatCurrency(imovel.secondBidValue)} />}
        <Metric label="Modalidade" value={imovel.modality} />
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={imovel.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Ver edital
        </a>
        <button
          type="button"
          onClick={() => setCalcOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Calculator className="h-3.5 w-3.5" strokeWidth={1.75} />
          Calcular rentabilidade
        </button>
        <Link
          href={`/leiloes/imoveis/financiamento?imovelId=${imovel.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
        >
          <Landmark className="h-3.5 w-3.5" strokeWidth={1.75} />
          Simular financiamento
        </Link>
      </div>

      <AuctionCalculatorModal
        open={calcOpen}
        onClose={() => setCalcOpen(false)}
        kind="imovel"
        initial={{
          title: imovel.title,
          purchasePrice: imovel.firstBidValue,
          resaleBaseValue: imovel.evaluationValue,
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
