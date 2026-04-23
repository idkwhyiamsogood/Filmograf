import { hasActiveFilters } from "@/features/filter/common/model/lib/validateFilters";
import { QueryClient, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";
import { Collection, collectionApi } from "@/entities/collection";
import { FilterState } from "@/features/filter";

interface Props {
  value: string;
  filterOptions: FilterState;
  pageSize?: number;
}

export const useInfiniteCollectionSearch = ({
  value,
  filterOptions,
  pageSize = 21,
}: Props) => {
  const queryClient = useQueryClient();
  const trimmed = value?.trim() ?? "";
  const filtersActive = hasActiveFilters(filterOptions);

  return useInfiniteQuery({
    queryKey: ["search-infinite-collections", trimmed, filterOptions, pageSize],
    enabled: Boolean(trimmed) || filtersActive,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await searchApi.searchCollections(
        trimmed,
        {
          genres: filterOptions.filterOptions.genres,
          tags: filterOptions.filterOptions.tags,
          strictMatch: filterOptions.strictMatch,
        },
        { page: pageParam, count: pageSize }
      );

      const ids = response.data.entityIds || [];
      const itemsPage = await getCollectionsWithCache(ids, queryClient);

      return {
        items: itemsPage,
        nextPage: ids.length === pageSize ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });
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
