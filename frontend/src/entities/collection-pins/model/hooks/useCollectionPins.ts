import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";

import { collecionPinsApi } from "../api/collectionPins.api";

export const useCollectionPins = () => {
  const { isGuest } = useAuth();

  const response = useQuery({
    queryKey: ["pins"],
    queryFn: () => collecionPinsApi.getMyPins(),
    // Гостю бэк отвечает 403.
    enabled: !isGuest,
  });

  return {
    data: response.data?.data.collectionIds || [],
    isLoading: response.isLoading && !isGuest,
  };
};
