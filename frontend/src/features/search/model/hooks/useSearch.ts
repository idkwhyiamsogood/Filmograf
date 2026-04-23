import { useInfiniteQuery } from "@tanstack/react-query";
import { searchApi } from "@/features/search/";
import type { FilterState } from "@/features/filter";
import { hasActiveFilters } from "@/features/filter/common/model/lib/validateFilters";
import { QueryParams } from "@/shared/types";

interface UseInfiniteSearchProps {
  value: string;
  filterOptions: FilterState;
  params: QueryParams;
}

export const useInfiniteSearch = ({
  value,
  filterOptions,
  params,
}: UseInfiniteSearchProps) => {
  const trimmed = value?.trim() ?? "";
  const filtersActive = hasActiveFilters(filterOptions);

  const pageSize = params.count ?? 20;
  const initialPage = 0;

  const query = useInfiniteQuery({
    queryKey: ["search-infinite-ids", trimmed, filterOptions, params],
    enabled: Boolean(trimmed) || filtersActive,
    initialPageParam: initialPage,
    queryFn: async ({ pageParam = initialPage }) => {
      if (!trimmed && !filtersActive) {
        return { ids: [], nextPage: null };
      }

      let response;

      if (filterOptions.filterOptions.targetType === "Movie") {
        const { tags, targetType, ...rest } = filterOptions.filterOptions;
        response = await searchApi.searchMovies(trimmed, {
          ...rest,
          strictMatch: filterOptions.strictMatch,
        });
      } else {
        response = await searchApi.searchCollections(trimmed, {
          genres: filterOptions.filterOptions.genres,
          tags: filterOptions.filterOptions.tags,
          strictMatch: filterOptions.strictMatch,
        });
      }

      const allIds = response.data.entityIds || [];
      const start = pageParam * pageSize;
      const end = start + pageSize;
      const idsPage = allIds.slice(start, end);

      const hasMore = end < allIds.length;

      return {
        ids: idsPage,
        nextPage: hasMore ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const allIds = query.data?.pages.flatMap((page) => page.ids) ?? [];

  return {
    ...query,
    entityIds: allIds,
    totalLoaded: allIds.length,
    pages: query.data?.pages,
  };
};
