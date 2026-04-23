import { useQuery } from "@tanstack/react-query";

import { searchApi } from "@/features/search/";

import type {
  FilterState
} from "@/features/filter";
import { hasActiveFilters } from "@/features/filter/common/model/lib/validateFilters";

export const useSearch = (value: string, filterOptions: FilterState) => {
  const trimmed = value?.trim() ?? "";
  const filtersActive = hasActiveFilters(filterOptions);

  return useQuery({
    queryKey: ["search", value, filterOptions.filterOptions, filterOptions.strictMatch],
    enabled: Boolean(trimmed) || filtersActive,
    placeholderData: { entityIds: [] },
    queryFn: async () => {
      if (!trimmed && !filtersActive) return { entityIds: [] };

      if (filterOptions.filterOptions.targetType === "Movie") {
        const { tags, targetType, ...rest } = filterOptions.filterOptions;

        const response = await searchApi.searchMovies(trimmed, {
          ...rest,
          strictMatch: filterOptions.strictMatch,
        });
        return response.data;
      } else {
        const response = await searchApi.searchCollections(trimmed, {
          genres: filterOptions.filterOptions.genres,
          tags: filterOptions.filterOptions.tags,
          strictMatch: filterOptions.strictMatch,
        });
        return response.data;
      }
    },
  });
};
