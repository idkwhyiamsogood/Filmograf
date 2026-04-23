import { useQuery } from "@tanstack/react-query";

import { searchApi } from "@/features/search/";

import type {
  FilterState
} from "@/features/filter";

export const useSearch = (value: string, filterOptions: FilterState) => {
  return useQuery({
    queryKey: ["search", filterOptions.filterOptions],
    queryFn: async () => {
      if (!value) return { entityIds: [] };

      if (filterOptions.filterOptions.targetType === "Movie") {
        const { tags, targetType, ...rest } = filterOptions.filterOptions;

        const response = await searchApi.searchMovies(value, {
          ...rest,
          strictMatch: filterOptions.strictMatch,
        });
        return response.data;
      } else {
        const response = await searchApi.searchCollections(value, {
          genres: filterOptions.filterOptions.genres,
          tags: filterOptions.filterOptions.tags,
          strictMatch: filterOptions.strictMatch,
        });
        return response.data;
      }
    },
  });
};
