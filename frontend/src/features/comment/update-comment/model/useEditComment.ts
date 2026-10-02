import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { commentApi, commentsKey, updateCommentInCache, type CommentsData } from "@/entities/comment";
import type { Entity } from "@/shared/types";

export const useEditComment = (entity: Entity) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit-comment"],
    mutationFn: ({ commentId, text }: { commentId: string; text: string }) =>
      commentApi.editCommentText(commentId, { text }),
    onMutate: async ({ commentId, text }) => {
      const key = commentsKey(entity);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsData>(key);
      updateCommentInCache(queryClient, entity, commentId, (c) => ({
        ...c,
        text,
        updateDate: new Date().toISOString(),
      }));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(commentsKey(entity), ctx?.previous);
      toast.error("Не удалось сохранить правку");
    },
  });
};
