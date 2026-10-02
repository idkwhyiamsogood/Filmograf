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
      queryClient.removeQueries({ queryKey: ["collection", id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["infinite-collections"] });
      toast.success("Подборка удалена");
    },
    onError: () => {
      toast.error("Не удалось удалить подборку");
    },
  });
};
