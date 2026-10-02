import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";
import { collectionApi } from "../api/collection.api";
import { COLLECTION_QUERY_PREFIXES, removeCollectionFromCache } from "../cache";

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: async (id: string) => {
      await collectionApi.deleteCollection(id);
    },
    // Карточка пропадает из всех списков и из избранного сразу.
    onMutate: async (id) => {
      const snapshot = await snapshotQueries(queryClient, [...COLLECTION_QUERY_PREFIXES, "pins"]);
      removeCollectionFromCache(queryClient, id);
      queryClient.setQueryData<string[]>(["pins"], (old) => old?.filter((p) => p !== id));
      return { snapshot };
    },
    onSuccess: () => toast.success("Подборка удалена"),
    onError: (_e, _id, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      toast.error("Не удалось удалить подборку");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-collections"] });
      queryClient.invalidateQueries({ queryKey: ["pins"] });
    },
  });
};
