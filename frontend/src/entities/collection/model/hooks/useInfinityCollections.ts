import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import type { Collection } from "../types";
import { SearchTypeCollection } from "@/shared/types";
import { useAuth } from "@/shared/hooks";

interface UseInfiniteCollectionsParams {
  pageSize?: number;
  initialPage?: number;
  type?: SearchTypeCollection;
}

export const useInfiniteCollections = (
  params: UseInfiniteCollectionsParams,
) => {
  const { pageSize = 20, initialPage = 0, type = "my" } = params;
  const queryClient = useQueryClient();
  const { isGuest, token } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    // «Мои» зависят от пользователя, рекомендации гостю закрыты на бэке.
    queryKey: ["infinite-collections", type, pageSize, type === "my" ? token.jwt : ""],
    enabled: !(isGuest && type === "recommended"),
    queryFn: async ({ pageParam = initialPage }) => {
      let idsResponse;

      switch (type) {
        case "recommended":
          idsResponse = await collectionApi.getRecommended({
            page: pageParam,
            count: pageSize,
          });
          // console.log(idsResponse);
          break;
        case "popular":
          idsResponse = await collectionApi.getPopular({
            page: pageParam,
            count: pageSize,
          });
          // console.log(idsResponse);
          break;
        case "my":
          idsResponse = await collectionApi.getMy({
            page: pageParam,
            count: pageSize,
          });
          break;
      }

      if (!idsResponse.data.ids) {
        throw new Error("Не удалось получить ID коллекций");
      }

      // Бэк пагинирует сам (Page/Count → skip/limit), в ответе — уже нужная
      // страница. Раньше фронт ещё раз резал её локально, и со второй
      // страницы список оказывался пустым.
      const ids = idsResponse.data.ids ?? [];
      if (ids.length === 0) return { collections: [], nextPage: null, ids: [] };

      const collections = await getCollectionsWithCache(ids, queryClient);

      return {
        collections,
        nextPage: ids.length === pageSize ? pageParam + 1 : null,
        ids,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: initialPage,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const allCollections = data?.pages.flatMap((page) => page.collections) ?? [];
  const allIds = data?.pages.flatMap((page) => page.ids) ?? [];

  return {
    collections: allCollections,
    collectionIds: allIds,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoading && !(isGuest && type === "recommended"),
    isError,
    error,
    refetch,
    totalCollections: allCollections.length,
    pages: data?.pages,
  };
};

async function getCollectionsWithCache(
  ids: string[],
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<Collection[]> {
  const byId = new Map<string, Collection>();
  const missing: string[] = [];

  for (const id of ids) {
    const cached = queryClient.getQueryData<Collection>(["collection", id]);
    if (cached) byId.set(id, cached);
    else missing.push(id);
  }

  if (missing.length > 0) {
    const { data } = await collectionApi.batchMany({ ids: missing });
    data?.forEach((col) => {
      queryClient.setQueryData(["collection", col.id], col);
      byId.set(col.id, col);
    });
  }

  // Порядок — как в ответе сервера, а не «сначала закэшированные».
  return ids.map((id) => byId.get(id)).filter((c): c is Collection => Boolean(c));
}
