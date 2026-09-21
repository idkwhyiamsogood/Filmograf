import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { CreateCollection } from "../types";
import { toast } from "sonner";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollection) =>
      collectionApi.createCollection(data),
    mutationKey: ["createCollection"],
    onSuccess: (response) => {
      try {
        const collection = response.data;

        queryClient.setQueryData(["collection", collection.id], collection);

        queryClient.invalidateQueries({
          queryKey: ["collections"],
          exact: false,
        });

        toast.success("Коллекция успешно создана!");
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      } catch (error) {
        toast.error("Ошибка при создании коллекции");
        console.error("Collection creation error:", error);
      }
    },
    onError: (error) => {
      toast.error("Не удалось создать коллекцию");
      console.log("collection creation failed", error);
    },
    onSettled: () => {
      console.log("collection creation settled");
    },
  });
};