import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";

import { toast } from "sonner";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await collectionApi.deleteCollection(id);
    },
    mutationKey: ["deleteCollection"],
    onSuccess: (_, id) => {
      queryClient.cancelQueries({ queryKey: ["collections", id] });
      queryClient.removeQueries({ queryKey: ["collections", id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });

      toast.success("Коллекция успешно удалена");
    },
    onError: () => {
      console.log("collection deletion failed");
      toast.error("При удалении коллекции, произошла ошибка");
    },
    onSettled: () => {
      console.log("collection deletion settled");
    },
  });
};
