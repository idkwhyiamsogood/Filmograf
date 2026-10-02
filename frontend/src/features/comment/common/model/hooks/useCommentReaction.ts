import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { commentApi, commentsKey, updateCommentInCache, type CommentsData } from "@/entities/comment";
import type { Entity } from "@/shared/types";

export type Reaction = "like" | "dislike" | null;

interface Params {
  commentId: string;
  reaction: Reaction;
  userId: string;
}

/** Лайк / дизлайк / снять реакцию — одним хуком, с мгновенным откликом. */
export const useCommentReaction = (entity: Entity) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["comment-reaction"],
    mutationFn: ({ commentId, reaction }: Params) =>
      reaction === "like"
        ? commentApi.likeComment(commentId)
        : reaction === "dislike"
          ? commentApi.dislikeComment(commentId)
          : commentApi.clearReaction(commentId),

    onMutate: async ({ commentId, reaction, userId }) => {
      const key = commentsKey(entity);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsData>(key);

      updateCommentInCache(queryClient, entity, commentId, (c) => ({
        ...c,
        likes: [...c.likes.filter((u) => u !== userId), ...(reaction === "like" ? [userId] : [])],
        dislikes: [...c.dislikes.filter((u) => u !== userId), ...(reaction === "dislike" ? [userId] : [])],
      }));

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(commentsKey(entity), ctx?.previous);
      toast.error("Не удалось сохранить реакцию");
    },
  });
};
