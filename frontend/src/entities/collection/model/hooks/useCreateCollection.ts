import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { CreateCollection } from "../types";

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
      } finally {
        window.location.reload();
      }
    },
    onError: () => {
      console.log("collection creation failed");
    },
    onSettled: () => {
      console.log("collection creation settled");
    },
  });
};
