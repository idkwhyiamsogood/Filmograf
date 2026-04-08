import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { searchApi } from "@/features/search/";

import type { FilterOptions } from "@/features/filter";

import { connection } from "../constants/connections";

export const useSearch = (value: string, filterOptions: FilterOptions) => {
  return useQuery({
    queryKey: ["search", filterOptions.targetType, value],
    queryFn: async () => {
      if (!value) return { entityIds: [] };

      if (filterOptions.targetType === "Movie") {
        const response = await searchApi.searchMovies(filterOptions, value, connection);
        return response.data;
      } else {
        const response = await searchApi.searchCollections(
          filterOptions,
          value,
          connection
        );
        return response.data;
      }
    },
    placeholderData: keepPreviousData,
    enabled: value.length > 0,
  });
};
