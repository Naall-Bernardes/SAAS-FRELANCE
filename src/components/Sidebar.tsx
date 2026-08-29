"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { NAV_GROUPS, findNavItem } from "@/lib/nav";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activeHref = findNavItem(pathname)?.href;

  return (
    <>
      {/* Backdrop no mobile, quando o menu está aberto */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm font-bold tracking-tight text-foreground">SAAS-FRELANCE</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-subtle-foreground">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.href === activeHref;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent-soft text-accent"
                          : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                        {item.label}
                      </span>
                      {item.comingSoon && (
                        <span className="rounded-full bg-surface-hover px-1.5 py-0.5 text-[10px] font-semibold text-subtle-foreground group-aria-[current=page]:bg-accent/10">
                          em breve
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
