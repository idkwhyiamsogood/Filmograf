import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { UpdateCollection } from "../types";
import { toast } from "sonner";

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCollection) =>
      collectionApi.updateCollection(data),
    mutationKey: ["updateCollection"],
    onSuccess: (response, variables) => {
      const updatedCollection = response.data;
      const { id } = variables;

      queryClient.setQueryData(["collection", id], updatedCollection);
      queryClient.invalidateQueries({ queryKey: ["collections"] });

      toast.success("Коллекция успешно обновлена")
    },
    onError: (error) => {
      console.error("Collection update failed:", error);
    },
    onSettled: () => {
      console.log("Collection update settled");
    },
  });
};
