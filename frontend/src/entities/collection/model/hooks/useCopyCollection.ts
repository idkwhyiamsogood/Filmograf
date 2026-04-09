"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { collectionApi } from "../api/collection.api";
import { toast } from "sonner";

export const useCopyCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await collectionApi.copyCollection(id),
    onSuccess: () => {
      toast.success("Успешно скопировано");
    },
    onError: (error) => {
      toast.error("Ошибка при копировании коллекции, попробуйте позже.");
      console.error("Ошибка при копировании коллекции:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
        exact: false,
      });
    },
  });
};
