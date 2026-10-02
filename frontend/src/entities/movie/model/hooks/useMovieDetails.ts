import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/movie.api";
import type { IMovie } from "../types/types";

/**
 * Страница фильма. В отличие от useMovie всегда ходит в GET /movies/{id}:
 * только эта ручка отдаёт оценку пользователя (ByUser) и записывает
 * просмотр в историю. Пока запрос идёт — показываем фильм из кэша списков.
 */
export const useMovieDetails = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["movie-details", id],
    queryFn: async () => {
      const { data } = await movieApi.getMovie(id);
      queryClient.setQueryData(["movie", id], data);
      // История изменилась — её ленты перезапросятся при следующем показе.
      queryClient.invalidateQueries({ queryKey: ["infinite-movies", "history"] });
      return data;
    },
    placeholderData: () => queryClient.getQueryData<IMovie>(["movie", id]),
    staleTime: 0,
  });
};
