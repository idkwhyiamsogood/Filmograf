import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";

import { collecionPinsApi } from "../api/collectionPins.api";

export const PINS_KEY = ["pins"] as const;

export const useCollectionPins = () => {
  const { isGuest } = useAuth();

  const query = useQuery({
    queryKey: PINS_KEY,
    // В кэше — просто массив id, его же правят оптимистичные pin/unpin.
    queryFn: async () => (await collecionPinsApi.getMyPins()).data.collectionIds ?? [],
    // Гостю бэк отвечает 403.
    enabled: !isGuest,
    staleTime: 60 * 1000,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading && !isGuest,
  };
};
