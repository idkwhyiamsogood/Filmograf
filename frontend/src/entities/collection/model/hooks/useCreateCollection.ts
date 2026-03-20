import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import { Collection, CreateCollection } from "../types";

import type { APIResponse } from "@/shared/types";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollection) =>
      collectionApi.createCollection(data),
    mutationKey: ["createCollection"],
    onSuccess: (response) => {
      const collection = response.data;

      queryClient.setQueryData(["collection", collection.id], collection);

      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => {
      console.log("collection creation failed");
    },
    onSettled: () => {
      console.log("collection creation settled");
    },
  });
};
