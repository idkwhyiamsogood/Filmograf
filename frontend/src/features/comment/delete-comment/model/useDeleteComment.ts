import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { commentApi, commentsKey, updateCommentInCache, type CommentsData } from "@/entities/comment";
import type { Entity } from "@/shared/types";

/** Удаление «мягкое», как на бэке: комментарий остаётся в ветке с пометкой. */
export const useDeleteComment = (entity: Entity) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: (commentId: string) => commentApi.deleteComment(commentId),
    onMutate: async (commentId) => {
      const key = commentsKey(entity);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsData>(key);
      updateCommentInCache(queryClient, entity, commentId, (c) => ({ ...c, isDeleted: true }));
      return { previous };
    },
    onSuccess: () => toast.success("Комментарий удалён"),
    onError: (_e, _id, ctx) => {
      queryClient.setQueryData(commentsKey(entity), ctx?.previous);
      toast.error("Не удалось удалить комментарий");
    },
  });
};
