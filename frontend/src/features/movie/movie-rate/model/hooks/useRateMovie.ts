import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { movieApi, MOVIE_QUERY_PREFIXES, updateMovieInCache, type IMovie } from "@/entities/movie";
import type { MoviesRates } from "@/entities/movie/model/types/types";
import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";

interface Props {
  rate: number;
  id: string;
}

/** Средняя оценка Filmograf с учётом новой оценки пользователя (приближённо). */
const recalcFilm = (movie: IMovie, prev: number, next: number) => {
  const film = movie.rates?.Film;
  if (!film || prev > 0) return film;
  return Number(((film + next) / 2).toFixed(1));
};

export const useRateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rate-movie"],
    mutationFn: async ({ rate, id }: Props) => await movieApi.rateMovie(rate, id),
    // Оценка сразу видна на карточке, в «Моих оценках» и во всех списках.
    onMutate: async ({ rate, id }) => {
      const snapshot = await snapshotQueries(queryClient, [...MOVIE_QUERY_PREFIXES, "my-rates"]);

      updateMovieInCache(queryClient, id, (m) => {
        const prev = m.rates?.ByUser ?? 0;
        return { ...m, rates: { ...m.rates, ByUser: rate, Film: recalcFilm(m, prev, rate) ?? m.rates?.Film } };
      });

      const now = new Date().toISOString();
      queryClient.setQueriesData<{ data: MoviesRates[] }>({ queryKey: ["my-rates"] }, (old) => {
        if (!old) return old;
        const exists = old.data.some((r) => r.movieId === id);
        const data = exists
          ? old.data.map((r) => (r.movieId === id ? { ...r, rate, updateDate: now } : r))
          : [{ movieId: id, rate, createDate: now, updateDate: now }, ...old.data];
        return { ...old, data };
      });

      return { snapshot };
    },
    onSuccess: (_, { rate }) => toast.success(`Оценка ${rate} сохранена`),
    onError: (error: Error, _v, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      console.error("Ошибка при выставлении рейтинга:", error);
      toast.error("Не удалось сохранить оценку, попробуйте позже");
    },
    onSettled: () => {
      // movie-details не перезапрашиваем: GET /movies/{id} засчитывается
      // бэком как просмотр. Список оценок и рекомендации считает сервер.
      queryClient.invalidateQueries({ queryKey: ["my-rates"] });

      queryClient.invalidateQueries({ queryKey: ["infinite-movies", "recommended"] });
    },
  });
};
