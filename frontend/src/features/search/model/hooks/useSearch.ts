import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { searchApi } from "@/features/search/";

import type {
  FilterOptions,
  FilterState,
  MovieParams,
} from "@/features/filter";

import { connection } from "../constants/connections";

export const useSearch = (value: string, filterOptions: FilterState) => {
  return useQuery({
    queryKey: ["search", filterOptions.filterOptions.targetType, value],
    queryFn: async () => {
      if (!value) return { entityIds: [] };

      console.log(filterOptions, "searched-filter-opt");

      if (filterOptions.filterOptions.targetType === "Movie") {
        const response = await searchApi.searchMovies(value, connection, {
          genres: filterOptions.filterOptions.genres,
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
    placeholderData: keepPreviousData,
  });
};
