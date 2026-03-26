// hooks/useInfiniteMovies.ts
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/movie.api";
import type { IMovie } from "../types/types";

interface UseInfiniteMoviesParams {
  pageSize?: number;
  initialPage?: number;
  type?: "top" | "recommended";
}

export const useInfiniteMovies = (params: UseInfiniteMoviesParams = {}) => {
  const { pageSize = 21, initialPage = 0, type = "top" } = params;
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
      
      if (type === "top") {
        idsResponse = await movieApi.getTop({ 
          page: pageParam, 
          count: pageSize 
        });
      } else {
        idsResponse = await movieApi.getRecommended({ 
          page: pageParam, 
          count: pageSize 
        });
      }
      
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
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000
  });

  const allMovies = data?.pages.flatMap(page => page.movies) ?? [];
  
  const allIds = data?.pages.flatMap(page => page.ids) ?? [];

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
  queryClient: ReturnType<typeof useQueryClient>
): Promise<IMovie[]> {
  const missing: string[] = [];
  const cachedMovies: IMovie[] = [];

  for (const id of ids) {
    const cached = queryClient.getQueryData<IMovie>(["movie", id]);
    if (cached) {
      cachedMovies.push(cached);
    } else {
      missing.push(id);
    }
  }

  if (missing.length === 0) {
    return cachedMovies;
  }

  const { data: missingMovies } = await movieApi.batchMany({ ids: missing });

  if (missingMovies) {
    missingMovies.forEach((movie) => {
      queryClient.setQueryData(["movie", movie.id], movie);
    });
    
    return [...cachedMovies, ...missingMovies];
  }

  return cachedMovies;
}