import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionApi.deleteCollection(id),
    mutationKey: ["deleteCollection"],
    onSuccess: (_, id) => {
      queryClient.cancelQueries({ queryKey: ["collections", id] });
      queryClient.removeQueries({ queryKey: ["collections", id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => {
      console.log("collection deletion failed");
    },
    onSettled: () => {
      console.log("collection deletion settled");
    },
  });
};
