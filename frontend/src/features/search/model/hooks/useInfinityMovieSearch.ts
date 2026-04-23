import { hasActiveFilters } from "@/features/filter/common/model/lib/validateFilters";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { searchApi } from "../api/search.api";
import { IMovie, movieApi } from "@/entities/movie";
import { FilterState } from "@/features/filter";

interface Props {
  value: string;
  filterOptions: FilterState;
  pageSize?: number;
}

export const useInfiniteMovieSearch = ({
  value,
  filterOptions,
  pageSize = 21,
}: Props) => {
  const queryClient = useQueryClient();
  const trimmed = value?.trim() ?? "";
  const filtersActive = hasActiveFilters(filterOptions);

  return useInfiniteQuery({
    queryKey: ["search-infinite-movies", trimmed, filterOptions, pageSize],
    enabled: Boolean(trimmed) || filtersActive,
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const { tags, targetType, ...rest } = filterOptions.filterOptions;

      const response = await searchApi.searchMovies(
        trimmed,
        { ...rest, strictMatch: filterOptions.strictMatch },
        { page: pageParam, count: pageSize },
      );

      const ids = response.data.entityIds || [];
      const itemsPage = await getMoviesWithCache(ids, queryClient);

      return {
        items: itemsPage,
        nextPage: ids.length === pageSize ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });
};

async function getMoviesWithCache(
  ids: string[],
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<IMovie[]> {
  if (ids.length === 0) return [];

  const missingIds: string[] = [];
  const cachedMoviesMap = new Map<string, IMovie>();

  for (const id of ids) {
    const cached = queryClient.getQueryData<IMovie>(["movie", id]);
    if (cached) {
      cachedMoviesMap.set(id, cached);
    } else {
      missingIds.push(id);
    }
  }

  if (missingIds.length > 0) {
    try {
      const { data: missingMovies } = await movieApi.batchMany({
        ids: missingIds,
      });

      if (missingMovies) {
        missingMovies.forEach((movie) => {
          queryClient.setQueryData(["movie", movie.id], movie);
          cachedMoviesMap.set(movie.id, movie);
        });
      }
    } catch (e) {
      console.error("Failed to fetch batch movies", e);
    }
  }

  return ids
    .map((id) => cachedMoviesMap.get(id))
    .filter((m): m is IMovie => !!m);
}
