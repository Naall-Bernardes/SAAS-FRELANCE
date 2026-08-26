"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/format";

/**
 * "há X min" muda de valor entre o render no servidor e a hidratação no
 * cliente (alguns segundos/minutos se passam), o que quebra a hidratação se
 * calculado direto no render. Aqui o valor inicial é determinístico
 * ("agora mesmo", igual nos dois lados) e só passa a refletir o tempo real
 * depois de montado — e continua "vivo", atualizando a cada minuto.
 */
export function RelativeTime({ date }: { date: Date }) {
  const [label, setLabel] = useState("agora mesmo");

  useEffect(() => {
    setLabel(formatRelativeTime(date));
    const id = setInterval(() => setLabel(formatRelativeTime(date)), 60_000);
    return () => clearInterval(id);
  }, [date]);

  return <>{label}</>;
}
