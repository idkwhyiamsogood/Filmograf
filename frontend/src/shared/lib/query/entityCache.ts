import type { QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Одна и та же сущность (фильм, подборка) лежит в кэше в разных формах:
 * отдельный ключ (["collection", id]), массив (["collections", ids]),
 * страницы бесконечных списков ({ pages: [{ collections: [...] }] }) и
 * результаты поиска ({ pages: [{ items: [...] }] }).
 *
 * Эти хелперы находят её везде по id — так оптимистичное обновление видно
 * сразу на всех экранах, а не только на том, где нажали кнопку.
 */

type WithId = { id: string };
/** Вернуть null — удалить сущность из списков */
export type EntityUpdater<T> = (entity: T) => T | null;

const isEntity = (v: unknown): v is WithId =>
  typeof v === "object" && v !== null && typeof (v as WithId).id === "string";

const patchArray = <T extends WithId>(arr: unknown[], id: string, fn: EntityUpdater<T>) => {
  let changed = false;
  const next: unknown[] = [];
  for (const item of arr) {
    if (isEntity(item) && item.id === id) {
      changed = true;
      const updated = fn(item as T);
      if (updated) next.push(updated);
    } else next.push(item);
  }
  return changed ? next : arr;
};

const patchPage = <T extends WithId>(page: unknown, id: string, fn: EntityUpdater<T>) => {
  if (Array.isArray(page)) return patchArray(page, id, fn);
  if (typeof page !== "object" || page === null) return page;
  let changed = false;
  const next: Record<string, unknown> = { ...(page as Record<string, unknown>) };
  for (const [k, v] of Object.entries(next)) {
    if (Array.isArray(v)) {
      const patched = patchArray(v, id, fn);
      if (patched !== v) {
        next[k] = patched;
        changed = true;
      }
    }
  }
  return changed ? next : page;
};

export const patchEntityInData = <T extends WithId>(
  data: unknown,
  id: string,
  fn: EntityUpdater<T>,
): unknown => {
  if (data == null) return data;
  if (isEntity(data) && data.id === id) return fn(data as T) ?? data;
  if (Array.isArray(data)) return patchArray(data, id, fn);
  if (typeof data === "object" && Array.isArray((data as { pages?: unknown[] }).pages)) {
    const inf = data as { pages: unknown[] };
    const pages = inf.pages.map((p) => patchPage(p, id, fn));
    return pages.some((p, i) => p !== inf.pages[i]) ? { ...inf, pages } : data;
  }
  return data;
};

const byPrefix = (prefixes: string[]) => ({
  predicate: ({ queryKey }: { queryKey: QueryKey }) =>
    prefixes.includes(String(queryKey[0])),
});

/** Обновить сущность во всех запросах с указанными префиксами ключей. */
export const updateEntityEverywhere = <T extends WithId>(
  qc: QueryClient,
  prefixes: string[],
  id: string,
  fn: EntityUpdater<T>,
) => {
  qc.setQueriesData(byPrefix(prefixes), (old: unknown) => patchEntityInData<T>(old, id, fn));
};

export type CacheSnapshot = [QueryKey, unknown][];

/** Снимок для отката: отменяем запросы в полёте и запоминаем данные. */
export const snapshotQueries = async (
  qc: QueryClient,
  prefixes: string[],
): Promise<CacheSnapshot> => {
  await qc.cancelQueries(byPrefix(prefixes));
  return qc.getQueriesData(byPrefix(prefixes));
};

export const restoreSnapshot = (qc: QueryClient, snapshot?: CacheSnapshot) => {
  snapshot?.forEach(([key, data]) => qc.setQueryData(key, data));
};
