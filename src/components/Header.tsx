"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { findNavItem } from "@/lib/nav";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const current = findNavItem(pathname);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/oportunidades?q=${encodeURIComponent(q)}` : "/oportunidades");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover md:hidden"
      >
        <Menu className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <h1 className="hidden shrink-0 text-sm font-semibold text-foreground sm:block">{current?.label ?? "SAAS-FRELANCE"}</h1>

      <form onSubmit={handleSearch} className="ml-auto flex w-full max-w-sm flex-1 items-center">
        <div className="relative w-full">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle-foreground"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar oportunidades..."
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-subtle-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </form>

      <button
        type="button"
        aria-label="Notificações"
        title="Notificações"
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
      >
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" />
      </button>

      <ThemeToggle />

      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
        title="Conta"
      >
        AB
      </div>
    </header>
  );
}
