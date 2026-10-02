import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { UpdateCollection } from "../types";
import { toast } from "sonner";
import type { Collection } from "../types";

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCollection) =>
      collectionApi.updateCollection(data),
    mutationKey: ["updateCollection"],
    onSuccess: (_response, { id, data }) => {
      // PATCH отвечает без тела — накладываем изменения на кэш сами.
      queryClient.setQueryData<Collection>(["collection", id], (old) =>
        old ? { ...old, ...data } : old,
      );
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["infinite-collections"] });

      toast.success("Подборка обновлена");
    },
    onError: (error) => {
      console.error("Collection update failed:", error);
      toast.error("Не удалось сохранить изменения");
    },
    onSettled: () => {
      console.log("Collection update settled");
    },
  });
};
