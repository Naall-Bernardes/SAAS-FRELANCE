/**
 * Stat tile — número único em destaque. Ver skill de dataviz:
 * "A single current value" deve ser um stat tile, não um gráfico de barra
 * única.
 */
interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle-foreground">{hint}</p>}
    </div>
  );
}
