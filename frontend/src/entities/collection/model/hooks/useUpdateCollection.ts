import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";
import { collectionApi } from "../api/collection.api";
import { COLLECTION_QUERY_PREFIXES, updateCollectionInCache } from "../cache";
import type { UpdateCollection } from "../types";

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCollection"],
    mutationFn: (data: UpdateCollection) => collectionApi.updateCollection(data),
    // PATCH отвечает без тела — изменения накладываем на кэш сами, сразу.
    onMutate: async ({ id, data }) => {
      const snapshot = await snapshotQueries(queryClient, COLLECTION_QUERY_PREFIXES);
      updateCollectionInCache(queryClient, id, (c) => ({
        ...c,
        ...data,
        updateDate: new Date().toISOString(),
      }));
      return { snapshot };
    },
    onSuccess: () => toast.success("Подборка обновлена"),
    onError: (error, _vars, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      console.error("Collection update failed:", error);
      toast.error("Не удалось сохранить изменения");
    },
    onSettled: (_d, _e, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
      // Сменилась видимость/теги — могли поменяться публичные выдачи.
      queryClient.invalidateQueries({ queryKey: ["infinite-collections"] });
    },
  });
};
