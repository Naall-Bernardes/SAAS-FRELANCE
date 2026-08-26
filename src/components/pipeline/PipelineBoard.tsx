"use client";

import { useMemo, useState, type DragEvent } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { PIPELINE_STAGES, SEED_PIPELINE, type PipelineCard, type PipelineStage } from "@/lib/pipeline";

export function PipelineBoard() {
  const [cards, setCards] = useLocalStorageState<PipelineCard[]>("saas-frelance:pipeline", SEED_PIPELINE);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const kpis = useMemo(() => {
    const active = cards.filter((c) => c.stage !== "Contratado" && c.stage !== "Perdida");
    const totalValue = active.reduce((sum, c) => sum + c.value, 0);
    const contratado = cards.filter((c) => c.stage === "Contratado").length;
    const encerrados = cards.filter((c) => c.stage === "Contratado" || c.stage === "Perdida").length;
    const conversao = encerrados > 0 ? Math.round((contratado / encerrados) * 100) : 0;
    const aguardando = cards.filter((c) => c.stage === "Proposta enviada").length;
    return { totalValue, conversao, ativos: active.length, aguardando };
  }, [cards]);

  function moveCard(id: string, stage: PipelineStage) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, stage: PipelineStage) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) moveCard(id, stage);
    setDragOverStage(null);
    setDraggingId(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          kpi={{
            label: "Valor total em pipeline",
            value: formatCurrency(kpis.totalValue),
            deltaLabel: "oportunidades ativas",
            deltaDirection: "neutral",
            tooltip: "Soma do valor de todas as oportunidades que ainda não foram contratadas ou perdidas.",
          }}
        />
        <StatCard
          kpi={{
            label: "Taxa de conversão",
            value: `${kpis.conversao}%`,
            deltaLabel: "contratado / encerrados",
            deltaDirection: "neutral",
            tooltip: "Percentual de oportunidades encerradas (contratadas ou perdidas) que viraram contrato.",
          }}
        />
        <StatCard
          kpi={{
            label: "Projetos ativos",
            value: String(kpis.ativos),
            deltaLabel: "em andamento no pipeline",
            deltaDirection: "neutral",
            tooltip: "Oportunidades que ainda estão em alguma etapa do funil, sem desfecho.",
          }}
        />
        <StatCard
          kpi={{
            label: "Propostas aguardando",
            value: String(kpis.aguardando),
            deltaLabel: "sem resposta do cliente",
            deltaDirection: "neutral",
            tooltip: "Propostas já enviadas, ainda sem retorno do cliente.",
          }}
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {PIPELINE_STAGES.map((stage) => {
          const stageCards = cards.filter((c) => c.stage === stage);
          const stageValue = stageCards.reduce((sum, c) => sum + c.value, 0);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage);
              }}
              onDragLeave={() => setDragOverStage((s) => (s === stage ? null : s))}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex w-72 shrink-0 flex-col rounded-2xl border transition-colors ${
                dragOverStage === stage ? "border-accent bg-accent-soft" : "border-border bg-surface"
              }`}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{stage}</p>
                  <p className="text-xs text-subtle-foreground">{formatCurrency(stageValue)}</p>
                </div>
                <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {stageCards.length}
                </span>
              </div>

              <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-2">
                {stageCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", card.id);
                      setDraggingId(card.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverStage(null);
                    }}
                    className={`cursor-grab space-y-2 rounded-xl border border-border bg-background p-3 shadow-card active:cursor-grabbing ${
                      draggingId === card.id ? "opacity-40" : ""
                    }`}
                  >
                    <p className="text-sm font-medium leading-snug text-foreground">{card.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.client} · {card.platform}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(card.value, card.currency)}
                      </span>
                      <Badge variant={card.matchScore >= 85 ? "good" : card.matchScore >= 70 ? "warning" : "critical"}>
                        {card.matchScore}%
                      </Badge>
                    </div>
                    <p className="rounded-md bg-surface-hover px-2 py-1 text-xs text-muted-foreground">
                      → {card.nextAction}
                    </p>
                  </div>
                ))}
                {stageCards.length === 0 && (
                  <p className="px-2 py-6 text-center text-xs text-subtle-foreground">Arraste um card pra cá</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
