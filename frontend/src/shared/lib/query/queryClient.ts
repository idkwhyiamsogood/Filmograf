import { QueryClient } from "@tanstack/react-query";
import { getApiErrorStatus } from "../utils/getApiErrorStatus";

/**
 * Общие настройки кэша:
 * - staleTime 1 мин: переходы между экранами не дёргают сеть заново,
 *   там, где данные меняются часто (история), ставим 0 точечно;
 * - gcTime 15 мин: вернулись на экран — данные уже есть, без скелетонов;
 * - 4xx не ретраим (403 гостя, 404) — повтор ничего не изменит;
 * - без refetchOnWindowFocus: на телефоне «фокус» — это каждое
 *   возвращение в приложение, и списки начинали прыгать.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = getApiErrorStatus(error);
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
