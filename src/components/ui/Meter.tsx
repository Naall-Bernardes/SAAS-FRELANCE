interface MeterProps {
  value: number;
  max?: number;
  colorVar?: string; // uma das variáveis de token, ex: "--accent"
}

/** Barra de progresso 0-100 usada nos scores (compatibilidade, valor, etc.) */
export function Meter({ value, max = 100, colorVar = "--accent" }: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${pct}%`, backgroundColor: `var(${colorVar})` }}
      />
    </div>
  );
}
