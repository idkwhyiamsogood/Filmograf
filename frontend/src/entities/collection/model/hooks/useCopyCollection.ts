import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";
import { collectionApi } from "../api/collection.api";
import { COLLECTION_QUERY_PREFIXES, prependToMyCollections, replaceCollectionInCache } from "../cache";
import type { Collection, CreateCollection } from "../types";

interface Props {
  id: string;
  data: CreateCollection;
  /** Исходная подборка — из неё собираем оптимистичную копию */
  source?: Collection;
}

export const useCopyCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: Props) => (await collectionApi.copyCollection(id, data)).data,
    onMutate: async ({ id, data, source }) => {
      const snapshot = await snapshotQueries(queryClient, COLLECTION_QUERY_PREFIXES);
      const now = new Date().toISOString();
      const temp: Collection = {
        ...(source ?? ({} as Collection)),
        ...data,
        id: `temp-${Date.now()}`,
        sourceCollectionId: id,
        userId: "",
        movies: source?.movies ?? [],
        moviePreviews: source?.moviePreviews ?? [],
        isByFilmograf: false,
        isDeleted: false,
        createDate: now,
        updateDate: now,
      };
      prependToMyCollections(queryClient, temp);
      return { snapshot, tempId: temp.id };
    },
    onSuccess: (copy, _v, ctx) => {
      if (ctx) replaceCollectionInCache(queryClient, ctx.tempId, copy);
      toast.success("Копия появилась в ваших подборках");
    },
    onError: (error, _v, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      console.error("Ошибка при копировании коллекции:", error);
      toast.error("Не удалось скопировать подборку, попробуйте позже");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["infinite-collections", "my"] });
    },
  });
};
