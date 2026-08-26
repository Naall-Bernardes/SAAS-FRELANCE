"use client";

import { Fragment, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  FileText,
  FolderOpen,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { SEED_CLIENTS, STATUS_LABEL, type ClientHistoryItem } from "@/lib/clients";

const HISTORY_ICON: Record<ClientHistoryItem["type"], LucideIcon> = {
  oportunidade: Briefcase,
  proposta: FileText,
  mensagem: MessageSquare,
  projeto: FolderOpen,
  contratacao: CheckCircle2,
};

export function ClientsBoard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-subtle-foreground">
            <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
            <th scope="col" className="px-4 py-3 font-medium">Plataforma</th>
            <th scope="col" className="px-4 py-3 font-medium">País</th>
            <th scope="col" className="px-4 py-3 font-medium">Projetos</th>
            <th scope="col" className="px-4 py-3 font-medium">Valor total</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Último contato</th>
            <th scope="col" className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {SEED_CLIENTS.map((client) => {
            const isOpen = expanded === client.id;
            return (
              <Fragment key={client.id}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : client.id)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-hover"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{client.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{client.platform}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{client.country}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.projectsCount}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {formatCurrency(client.totalValue)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{STATUS_LABEL[client.status]}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                    <RelativeTime date={new Date(client.lastContactAt)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronDown
                      className={`ml-auto h-4 w-4 text-subtle-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.75}
                    />
                  </td>
                </tr>
                {isOpen && (
                  <tr className="border-b border-border bg-background last:border-0">
                    <td colSpan={8} className="px-4 py-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
                        Histórico
                      </p>
                      <ul className="space-y-2">
                        {client.history.map((item, i) => {
                          const Icon = HISTORY_ICON[item.type];
                          return (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted-foreground">
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </span>
                              {item.label}
                              <span className="ml-auto shrink-0 text-xs text-subtle-foreground">
                                <RelativeTime date={new Date(Date.now() - item.daysAgo * 24 * 60 * 60_000)} />
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
