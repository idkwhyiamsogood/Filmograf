import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/movie.api";
import type { IMovie } from "../types/types";

export const useMovie = (ids: string[] | string) => {
  const queryClient = useQueryClient();

  const getMovies = async (ids: string[] | string) => {
    if (Array.isArray(ids)) {
      const missing: string[] = [];
      const answer: IMovie[] = [];

      for (const id of ids) {
        const item = queryClient.getQueryData<IMovie>(["movie", id]);
        console.log(item);

        if (item) answer.push(item);
        else missing.push(id);
      }

      if (missing.length === 0) {
        return answer;
      }

      const { data: missingMovies } = await movieApi.batchMany({
        ids: missing,
      });

      if (missingMovies) {
        missingMovies.forEach((movie) => {
          queryClient.setQueryData(["movie", movie.id], movie);
        });

        return answer.concat(missingMovies);
      }

      return null;
    } else {
      const cachedMovie = queryClient.getQueryData<IMovie>(["movie", ids]);

      if (cachedMovie) {
        return [cachedMovie];
      }

      console.log(ids);
      const { data: movie } = await movieApi.getMovie(ids);

      if (movie) {
        queryClient.setQueryData(["movie", ids], movie);
        return [movie];
      }

      return null;
    }
  };

  return useQuery({
    queryKey: ["movies", Array.isArray(ids) ? ids.sort() : ids],
    queryFn: () => getMovies(ids),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
