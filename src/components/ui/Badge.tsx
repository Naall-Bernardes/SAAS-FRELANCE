import type { ReactNode } from "react";

export type BadgeVariant = "accent" | "good" | "warning" | "critical" | "violet" | "hot" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  accent: "bg-accent-soft text-accent",
  good: "bg-good-soft text-good",
  warning: "bg-warning-soft text-warning",
  critical: "bg-critical-soft text-critical",
  violet: "bg-violet-soft text-violet",
  hot: "bg-hot-soft text-hot",
  neutral: "bg-surface-hover text-muted-foreground",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
