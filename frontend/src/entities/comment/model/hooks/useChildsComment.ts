import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Entity } from "@/shared/types";
import { commentApi } from "../api/comment.api";
import { updateCommentInCache } from "../cache";

/** Подгрузить ветку ответов (GET /comments/{id}/full) и вписать её в дерево. */
export const useChildsComment = (entity: Entity) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["load-replies"],
    mutationFn: async (commentId: string) => (await commentApi.getCommentsWithChilds(commentId)).data,
    onSuccess: (full, commentId) => {
      const loaded = Array.isArray(full) ? full.find((c) => c.id === commentId) ?? full[0] : full;
      if (!loaded) return;
      updateCommentInCache(queryClient, entity, commentId, (c) => ({
        ...c,
        childs: loaded.childs ?? [],
        childsCount: loaded.childsCount ?? c.childsCount,
      }));
    },
  });
};
