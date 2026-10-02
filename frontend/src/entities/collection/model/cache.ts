import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { updateEntityEverywhere, type EntityUpdater } from "@/shared/lib/query/entityCache";
import type { Collection } from "./types";

/** Все ключи, где может лежать подборка. */
export const COLLECTION_QUERY_PREFIXES = [
  "collection",
  "collections",
  "infinite-collections",
  "search-infinite-collections",
];

export const updateCollectionInCache = (
  qc: QueryClient,
  id: string,
  fn: EntityUpdater<Collection>,
) => updateEntityEverywhere<Collection>(qc, COLLECTION_QUERY_PREFIXES, id, fn);

/** Убрать подборку из всех списков (одиночный ключ удаляем отдельно). */
export const removeCollectionFromCache = (qc: QueryClient, id: string) => {
  updateEntityEverywhere<Collection>(
    qc,
    ["collections", "infinite-collections", "search-infinite-collections"],
    id,
    () => null,
  );
  qc.removeQueries({ queryKey: ["collection", id], exact: true });
};

type CollectionsPage = { collections: Collection[]; ids: string[]; nextPage: number | null };

/**
 * Добавить подборку в «Мои подборки» (новая или копия). В конец — как
 * отдаёт сервер (порядок создания), чтобы после ответа ничего не прыгало.
 */
export const prependToMyCollections = (qc: QueryClient, collection: Collection) => {
  qc.setQueryData(["collection", collection.id], collection);
  qc.setQueriesData<InfiniteData<CollectionsPage>>(
    { queryKey: ["infinite-collections", "my"] },
    (old) => {
      if (!old?.pages.length) return old;
      const last = old.pages[old.pages.length - 1];
      return {
        ...old,
        pages: [
          ...old.pages.slice(0, -1),
          {
            ...last,
            collections: [...last.collections.filter((c) => c.id !== collection.id), collection],
            ids: [...last.ids.filter((i) => i !== collection.id), collection.id],
          },
        ],
      };
    },
  );
};

/** Поменять временный id (temp-…) на серверный после ответа. */
export const replaceCollectionInCache = (qc: QueryClient, tempId: string, real: Collection) => {
  updateCollectionInCache(qc, tempId, () => real);
  qc.setQueriesData<InfiniteData<CollectionsPage>>(
    { queryKey: ["infinite-collections", "my"] },
    (old) =>
      old && {
        ...old,
        pages: old.pages.map((p) => ({ ...p, ids: p.ids.map((i) => (i === tempId ? real.id : i)) })),
      },
  );
  qc.removeQueries({ queryKey: ["collection", tempId], exact: true });
  qc.setQueryData(["collection", real.id], real);
};
