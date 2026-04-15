import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import type { Collection } from "../types";

interface UseInfiniteCollectionsParams {
  pageSize?: number;
  initialPage?: number;
  type?: "popular" | "recommended" | "my";
}

export const useInfiniteCollections = (
  params: UseInfiniteCollectionsParams,
) => {
  const { pageSize = 20, initialPage = 0, type = "my" } = params;
  const queryClient = useQueryClient();

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
    queryKey: ["infinite-collections", type, pageSize],
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

      const idsEntity = idsResponse.data;
      console.log(idsEntity);
      const allIds = idsEntity.ids || [];

      const start = pageParam * pageSize;
      const end = start + pageSize;
      const movieIdsPage = allIds.slice(start, end);

      if (movieIdsPage.length === 0) {
        return {
          collections: [],
          nextPage: null,
          ids: [],
        };
      }

      const collections = await getCollectionsWithCache(
        movieIdsPage,
        queryClient,
      );

      const hasMore = end < allIds.length;

      return {
        collections,
        nextPage: hasMore ? pageParam + 1 : null,
        ids: movieIdsPage,
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
    isLoading,
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
  const missing: string[] = [];
  const cachedData: Collection[] = [];

  for (const id of ids) {
    const cached = queryClient.getQueryData<Collection>(["collection", id]);
    if (cached) {
      cachedData.push(cached);
    } else {
      missing.push(id);
    }
  }

  if (missing.length === 0) {
    return cachedData;
  }

  const { data: missingCollections } = await collectionApi.batchMany({
    ids: missing,
  });

  if (missingCollections) {
    missingCollections.forEach((col) => {
      queryClient.setQueryData(["collection", col.id], col);
    });

    return [...cachedData, ...missingCollections];
  }

  return cachedData;
}
