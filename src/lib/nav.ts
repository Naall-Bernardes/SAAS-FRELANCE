import {
  LayoutDashboard,
  Briefcase,
  Radar,
  Bookmark,
  Bell,
  Search,
  KanbanSquare,
  FileText,
  Users,
  Sparkles,
  BarChart3,
  TrendingUp,
  UserCircle2,
  FolderOpen,
  Plug,
  Settings,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** true = tela ainda não implementada nesta fase (aparece como placeholder navegável) */
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Fonte única de verdade da navegação — usada pela Sidebar e pelo título do Header. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Principal",
    items: [{ href: "/", label: "Início", icon: LayoutDashboard }],
  },
  {
    label: "Oportunidades",
    items: [
      { href: "/oportunidades", label: "Oportunidades", icon: Briefcase },
      { href: "/radar", label: "Radar", icon: Radar },
      { href: "/salvos", label: "Salvos", icon: Bookmark, comingSoon: true },
      { href: "/alertas", label: "Alertas", icon: Bell, comingSoon: true },
      { href: "/minhas-buscas", label: "Minhas Buscas", icon: Search, comingSoon: true },
    ],
  },
  {
    label: "Comercial",
    items: [
      { href: "/pipeline", label: "Pipeline", icon: KanbanSquare, comingSoon: true },
      { href: "/propostas", label: "Propostas", icon: FileText, comingSoon: true },
      { href: "/clientes", label: "Clientes", icon: Users, comingSoon: true },
    ],
  },
  {
    label: "Inteligência",
    items: [
      { href: "/match-ia", label: "Match IA", icon: Sparkles, comingSoon: true },
      { href: "/analises", label: "Análises", icon: BarChart3 },
      { href: "/mercado", label: "Mercado", icon: TrendingUp, comingSoon: true },
    ],
  },
  {
    label: "Conta",
    items: [
      { href: "/meu-perfil", label: "Meu Perfil", icon: UserCircle2, comingSoon: true },
      { href: "/portfolio", label: "Portfólio", icon: FolderOpen, comingSoon: true },
      { href: "/integracoes", label: "Integrações", icon: Plug, comingSoon: true },
      { href: "/configuracoes", label: "Configurações", icon: Settings, comingSoon: true },
      { href: "/plano", label: "Plano", icon: CreditCard, comingSoon: true },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

export function findNavItem(pathname: string): NavItem | undefined {
  return ALL_NAV_ITEMS.find(
    (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
  );
}
