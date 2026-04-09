import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collecionPinsApi } from "../api/collectionPins.api";

import { toast } from "sonner";

export const useUnpinCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      await collecionPinsApi.unpinCollection(id),
    onSuccess: (data) => {
      queryClient.setQueryData(["pins"], () => data);
      toast.success("Успешно удалено.");
    },
    onError: () => {
      toast.error("При удаления коллекции из избраного произошла ошибка");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
  });
};
