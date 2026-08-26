"use client";

import { useLocalStorageState } from "./use-local-storage-state";

export const COLLECTIONS = [
  { key: "ver-depois", label: "Ver depois" },
  { key: "alta-prioridade", label: "Alta prioridade" },
  { key: "power-bi", label: "Power BI" },
  { key: "automacao", label: "Automação" },
  { key: "desenvolvimento", label: "Desenvolvimento" },
  { key: "engenharia", label: "Engenharia" },
] as const;

export type CollectionKey = (typeof COLLECTIONS)[number]["key"];
export const DEFAULT_COLLECTION: CollectionKey = "ver-depois";

/** Mapa opportunityId -> coleção. Toda oportunidade salva cai em "Ver depois" até o usuário mover. */
export function useCollections() {
  const [map, setMap] = useLocalStorageState<Record<string, CollectionKey>>(
    "saas-frelance:collections",
    {}
  );

  function getCollection(id: string): CollectionKey {
    return map[id] ?? DEFAULT_COLLECTION;
  }

  function setCollection(id: string, collection: CollectionKey) {
    setMap((prev) => ({ ...prev, [id]: collection }));
  }

  return { getCollection, setCollection };
}
