"use client";

import { useMemo, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/Badge";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import { SEED_PROPOSALS, STATUS_META, type ProposalStatus } from "@/lib/proposals";
import { FileText } from "lucide-react";

export function ProposalsBoard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProposalStatus | "all">("all");

  const proposals = SEED_PROPOSALS;

  const stats = useMemo(() => {
    const total = proposals.length;
    const responded = proposals.filter((p) => p.respondedAt).length;
    const hired = proposals.filter((p) => p.status === "contratado").length;
    const avgValue = proposals.reduce((sum, p) => sum + p.value, 0) / total;
    const responseTimes = proposals
      .filter((p) => p.respondedAt)
      .map((p) => (new Date(p.respondedAt!).getTime() - new Date(p.sentAt).getTime()) / (24 * 60 * 60_000));
    const avgResponseDays = responseTimes.length
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : null;
    return {
      responseRate: Math.round((responded / total) * 100),
      hireRate: Math.round((hired / total) * 100),
      avgValue,
      avgResponseDays,
    };
  }, [proposals]);

  const filtered = proposals.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      if (!p.project.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          kpi={{
            label: "Taxa de resposta",
            value: `${stats.responseRate}%`,
            deltaLabel: `${proposals.filter((p) => p.respondedAt).length} de ${proposals.length} propostas`,
            deltaDirection: "neutral",
            tooltip: "Percentual de propostas que tiveram algum retorno do cliente.",
          }}
        />
        <StatCard
          kpi={{
            label: "Taxa de contratação",
            value: `${stats.hireRate}%`,
            deltaLabel: `${proposals.filter((p) => p.status === "contratado").length} contratos fechados`,
            deltaDirection: "neutral",
            tooltip: "Percentual de propostas enviadas que viraram contrato.",
          }}
        />
        <StatCard
          kpi={{
            label: "Valor médio das propostas",
            value: formatCurrency(stats.avgValue),
            deltaLabel: "todas as moedas convertidas em BRL na exibição",
            deltaDirection: "neutral",
            tooltip: "Valor médio proposto, considerando todas as propostas do histórico.",
          }}
        />
        <StatCard
          kpi={{
            label: "Tempo médio até resposta",
            value: stats.avgResponseDays != null ? `${stats.avgResponseDays.toFixed(1)} dias` : "—",
            deltaLabel: "entre envio e retorno do cliente",
            deltaDirection: "neutral",
            tooltip: "Tempo médio, em dias, entre o envio da proposta e a primeira resposta do cliente.",
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por projeto ou cliente..."
          className="min-w-[220px] flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProposalStatus | "all")}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="all">Todos os status</option>
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.emoji} {meta.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhuma proposta encontrada" description="Ajuste a busca ou o filtro de status." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-subtle-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Projeto</th>
                <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
                <th scope="col" className="px-4 py-3 font-medium">Plataforma</th>
                <th scope="col" className="px-4 py-3 font-medium">Valor</th>
                <th scope="col" className="px-4 py-3 font-medium">Enviada</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Match</th>
                <th scope="col" className="px-4 py-3 font-medium">Resposta</th>
                <th scope="col" className="px-4 py-3 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const meta = STATUS_META[p.status];
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium text-foreground">{p.project}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.client}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{p.platform}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                      {formatCurrency(p.value, p.currency)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      <RelativeTime date={new Date(p.sentAt)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={meta.variant}>
                        {meta.emoji} {meta.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.matchScore}%</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {p.respondedAt ? <RelativeTime date={new Date(p.respondedAt)} /> : "—"}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{p.result}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
