import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/movie.api";
import type { IMovie } from "../types/types";
import type { SearchTypeMovie } from "@/shared/types";

interface UseInfiniteMoviesParams {
  pageSize?: number;
  initialPage?: number;
  type?: SearchTypeMovie;
  staleTime?: number;
}

export const useInfiniteMovies = (params: UseInfiniteMoviesParams = {}) => {
  const {
    pageSize = 21,
    initialPage = 0,
    type = "top",
    staleTime = 5 * 60 * 1000,
  } = params;
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
    queryKey: ["infinite-movies", type, pageSize],
    queryFn: async ({ pageParam = initialPage }) => {
      let idsResponse;

      switch (type) {
        case "recommended":
          idsResponse = await movieApi.getRecommended({
            page: pageParam,
            count: pageSize,
          });
          break;
        case "top":
          idsResponse = await movieApi.getTop({
            page: pageParam,
            count: pageSize,
          });
          break;
        case "popular":
          idsResponse = await movieApi.getPopular({
            page: pageParam,
            count: pageSize,
          });
          break;
        case "history":
          idsResponse = await movieApi.getHistory({
            page: pageParam,
            count: pageSize,
          });
          break;
      };

      if (!idsResponse.data) {
        throw new Error("Не удалось получить ID фильмов");
      }

      const idsEntity = idsResponse.data;
      const movieIds = idsEntity.ids || [];

      if (movieIds.length === 0) {
        return {
          movies: [],
          nextPage: null,
          ids: [],
        };
      }

      const movies = await getMoviesWithCache(movieIds, queryClient);

      const hasMore = movies.length === pageSize;

      return {
        movies,
        nextPage: hasMore ? pageParam + 1 : null,
        ids: movieIds,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: initialPage,
    staleTime,
    gcTime: 10 * 60 * 1000,
  });

  const allMovies = data?.pages.flatMap((page) => page.movies) ?? [];

  const allIds = data?.pages.flatMap((page) => page.ids) ?? [];

  return {
    movies: allMovies,
    movieIds: allIds,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    totalMovies: allMovies.length,
    pages: data?.pages,
  };
};

async function getMoviesWithCache(
  ids: string[],
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<IMovie[]> {
  const moviesById = new Map<string, IMovie>();
  const missing: string[] = [];

  for (const id of ids) {
    const cached = queryClient.getQueryData<IMovie>(["movie", id]);
    if (cached) {
      moviesById.set(id, cached);
    } else {
      missing.push(id);
    }
  }

  if (missing.length > 0) {
    const { data: missingMovies } = await movieApi.batchMany({ ids: missing });

    missingMovies?.forEach((movie) => {
      queryClient.setQueryData(["movie", movie.id], movie);
      moviesById.set(movie.id, movie);
    });
  }

  // Сохраняем порядок ids из ответа: для топа и истории он важен.
  return ids
    .map((id) => moviesById.get(id))
    .filter((movie): movie is IMovie => !!movie);
}
