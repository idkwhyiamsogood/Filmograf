import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

/** Публичный профиль автора (подборки, комментария) с кэшем. */
export const useUserLight = (userId?: string) =>
  useQuery({
    queryKey: ["user-light", userId],
    queryFn: async () => (await userApi.getUser(userId!)).data,
    enabled: Boolean(userId),
    staleTime: 30 * 60 * 1000,
  });
