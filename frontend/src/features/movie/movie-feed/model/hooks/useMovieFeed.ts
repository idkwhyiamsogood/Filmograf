import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { movieFeedApi, type FeedMovies } from "@/entities/movie";

const onError = (error: Error) => {
  console.error("Ошибка парсинга:", error);
  toast.error("Не удалось выполнить операцию, попробуйте позже");
};

export const useParseSourceMovie = () =>
  useMutation({
    mutationFn: (data: FeedMovies) => movieFeedApi.parseSourceMovie(data),
    onSuccess: () => toast.success("Фильм отправлен на парсинг"),
    onError,
  });

export const useParseSourceCollection = () =>
  useMutation({
    mutationFn: (data: FeedMovies) => movieFeedApi.parseSourceCollection(data),
    onSuccess: () => toast.success("Подборка отправлена на парсинг"),
    onError,
  });

export const useCompileChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => movieFeedApi.compileChart(),
    onSuccess: () => {
      toast.success("Чарт пересобран");
      queryClient.invalidateQueries({ queryKey: ["infinite-movies"] });
    },
    onError,
  });
};

export const useReParseMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => movieFeedApi.reParseOneMovie(movieId),
    onSuccess: (_, movieId) => {
      toast.success("Фильм перепарсен");
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
    },
    onError,
  });
};

export const useFixParsingBugs = () =>
  useMutation({
    mutationFn: async () => (await movieFeedApi.fixParsingBugs()).data,
    onSuccess: (count) => toast.success(`Исправлено фильмов: ${count}`),
    onError,
  });
