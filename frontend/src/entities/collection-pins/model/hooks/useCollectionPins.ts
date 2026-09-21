import { useQuery } from "@tanstack/react-query";

import { collecionPinsApi } from "../api/collectionPins.api";

export const useCollectionPins = () => {
  const response = useQuery({
    queryKey: ["pins"],
    queryFn: () => collecionPinsApi.getMyPins(),
  });

  return {
    data: response.data?.data.collectionIds || [],
    isLoading: response.isLoading
  }
};
