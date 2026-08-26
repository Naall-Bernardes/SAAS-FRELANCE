"use client";

import { useEffect, useState } from "react";

/**
 * Estado com persistência em localStorage — carrega no mount, salva a cada
 * mudança depois de hidratado (evita sobrescrever o storage com o valor
 * inicial antes da leitura terminar). Usado pelas telas de configuração
 * (alertas, buscas, pipeline, perfil, portfólio, integrações...) pra dar
 * uma sensação real de "isso fica salvo", mesmo sem backend ainda.
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      // segue com o valor inicial
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage indisponível — segue só em memória
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
