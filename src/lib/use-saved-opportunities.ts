"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "saas-frelance:saved-opportunities";

/**
 * Persiste localmente (por navegador) quais oportunidades o usuário marcou
 * como salvas — dá pra reaproveitar a mesma chave quando a tela /salvos
 * for implementada de verdade, sem precisar migrar nada.
 */
export function useSavedOpportunities() {
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(new Set(JSON.parse(raw)));
    } catch {
      // localStorage indisponível — segue com o estado em memória
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // segue só em memória
      }
      return next;
    });
  }, []);

  return { saved, toggle };
}
