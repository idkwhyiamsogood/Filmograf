import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi, type IMovie } from "@/entities/movie";
import { toast } from "sonner";

interface Props {
  rate: number;
  id: string;
}

export const useRateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rate-movie"],
    mutationFn: async ({ rate, id }: Props) => await movieApi.rateMovie(rate, id),
    // Оценка сразу видна на странице фильма, не дожидаясь ответа.
    onMutate: ({ rate, id }) => {
      const patch = (old?: IMovie) =>
        old ? { ...old, rates: { ...old.rates, ByUser: rate } } : old;
      queryClient.setQueryData<IMovie>(["movie", id], patch);
      queryClient.setQueryData<IMovie>(["movie-details", id], patch);
    },
    onSuccess: (_, { rate }) => {
      toast.success(`Оценка ${rate} сохранена`);
    },
    onError: (error: Error) => {
      console.error("Ошибка при выставлении рейтинга:", error);
      toast.error("Не удалось сохранить оценку, попробуйте позже");
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["my-rates"] });
      queryClient.invalidateQueries({ queryKey: ["movie-details", id] });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["infinite-movies", "recommended"] });
    },
  });
};
