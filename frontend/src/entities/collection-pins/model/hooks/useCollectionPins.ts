import { useQuery } from "@tanstack/react-query";

import { collecionPinsApi } from "../api/collectionPins.api";

export const useCollectionPins = () => {
  return useQuery({
    queryKey: ["pins"],
    queryFn: () => collecionPinsApi.getMyPins(),
  });
};
