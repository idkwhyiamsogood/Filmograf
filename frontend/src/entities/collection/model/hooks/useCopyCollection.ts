"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCollection } from "../types";

import { collectionApi } from "../api/collection.api";
import { toast } from "sonner";

interface Props {
  id: string;
  data: CreateCollection;
}

export const useCopyCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Props) =>
      await collectionApi.copyCollection(data.id, data.data),
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
