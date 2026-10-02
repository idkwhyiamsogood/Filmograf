import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { genreApi } from "../api/genres.api";
import { useGenres } from "./useGenres";

export const useGenresSearch = (query: string) => {
  const { data: genres, isLoading: isGenresLoading } = useGenres();

  const searchQuery = useQuery({
    queryKey: ["genres", "search-ids", query],
    queryFn: async () => {
      const { data } = await genreApi.searchGenres(query);
      return data?.entityIds || [];
    },
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

  const foundIds = searchQuery.data || [];

  return {
    data: query ? genres.filter((g) => foundIds.includes(g.id)) : genres,
    isLoading: isGenresLoading || searchQuery.isLoading,
    isError: searchQuery.isError,
  };
};
