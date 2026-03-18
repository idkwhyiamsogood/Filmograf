import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collecionPinsApi } from "../api/collectionPins.api";

import { toast } from "sonner";

export const useCollectionUnpin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collecionPinsApi.unpinCollection,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["pins"], (oldData: string[]) =>
        oldData.filter((pin) => pin !== id),
      );
    },
    onError: () => {
      toast.error("При удаления коллекции из избраного произошла ошибка");
    },
  });
};
