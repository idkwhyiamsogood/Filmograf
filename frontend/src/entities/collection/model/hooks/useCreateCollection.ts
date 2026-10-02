import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";
import { collectionApi } from "../api/collection.api";
import { COLLECTION_QUERY_PREFIXES, prependToMyCollections, replaceCollectionInCache } from "../cache";
import type { Collection, CreateCollection } from "../types";

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCollection"],
    mutationFn: async (data: CreateCollection) => (await collectionApi.createCollection(data)).data,
    // Подборка сразу появляется в «Моих» — с временным id до ответа сервера.
    onMutate: async (data) => {
      const snapshot = await snapshotQueries(queryClient, COLLECTION_QUERY_PREFIXES);
      const now = new Date().toISOString();
      const temp: Collection = {
        ...data,
        id: `temp-${Date.now()}`,
        userId: "",
        sourceCollectionId: "",
        movies: [],
        moviePreviews: [],
        isByFilmograf: false,
        isDeleted: false,
        createDate: now,
        updateDate: now,
      };
      prependToMyCollections(queryClient, temp);
      return { snapshot, tempId: temp.id };
    },
    onSuccess: (collection, _vars, ctx) => {
      if (ctx) replaceCollectionInCache(queryClient, ctx.tempId, collection);
      toast.success(`Подборка «${collection.name}» создана`);
    },
    onError: (error, _vars, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      console.error("collection creation failed", error);
      toast.error("Не удалось создать подборку");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-collections", "my"] });
    },
  });
};
