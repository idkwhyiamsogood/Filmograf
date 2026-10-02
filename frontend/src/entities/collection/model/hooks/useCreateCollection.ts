import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { CreateCollection } from "../types";
import { toast } from "sonner";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollection) => collectionApi.createCollection(data),
    mutationKey: ["createCollection"],
    onSuccess: ({ data: collection }) => {
      queryClient.setQueryData(["collection", collection.id], collection);
      // Списки «Мои подборки» перезапросятся сами — без перезагрузки страницы.
      queryClient.invalidateQueries({ queryKey: ["infinite-collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections"], exact: false });
      toast.success(`Подборка «${collection.name}» создана`);
    },
    onError: (error) => {
      console.error("collection creation failed", error);
      toast.error("Не удалось создать подборку");
    },
  });
};
