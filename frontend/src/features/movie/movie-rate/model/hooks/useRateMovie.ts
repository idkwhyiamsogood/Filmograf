import { useMutation, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "@/entities/movie";
import { toast } from "sonner";

interface Props {
  rate: number;
  id: string;
}

export const useRateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rate-movie"],
    mutationFn: async ({ rate, id }: Props) =>
      await movieApi.rateMovie(rate, id),
    onSuccess: () => {
      toast.success("Оценка успешно поставлена");
    },
    onError: (error: Error) => {
      console.error("Ошибка при выставлении рейтинга:", error);
      toast.error("При выставлении оценки произошла ошибка, попробуйте позже");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-rates"] });
    },
  });
};
