import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { movieApi } from "../api/movie.api";

export const useMyRates = () => {
  const { isGuest, token } = useAuth();

  return useQuery({
    // Оценки привязаны к пользователю — в ключе токен, чтобы после входа
    // не показывать чужой кэш.
    queryKey: ["my-rates", token.jwt],
    queryFn: async () => await movieApi.getMyRates(),
    select: (data) => data.data,
    staleTime: 10000,
    // Гостю бэк отвечает 403.
    enabled: !isGuest && Boolean(token.jwt),
  });
};
