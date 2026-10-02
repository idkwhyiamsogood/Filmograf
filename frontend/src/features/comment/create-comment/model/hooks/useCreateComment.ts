import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  commentApi,
  commentsKey,
  insertReply,
  updateCommentInCache,
  updateCommentsCache,
  type Comment,
  type CommentsData,
} from "@/entities/comment";
import type { Entity } from "@/shared/types";

interface Params {
  entity: Entity;
  text: string;
  /** Ответ на комментарий (любой глубины); без него — корневой */
  parentId?: string;
  /** Автор — чтобы оптимистичный комментарий сразу был подписан */
  userId: string;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-comment"],
    mutationFn: async ({ entity, text, parentId }: Params) =>
      (parentId
        ? await commentApi.createChildComment(parentId, { text })
        : await commentApi.createComment(entity.entityId, entity.type, { text })
      ).data,

    onMutate: async ({ entity, text, parentId, userId }) => {
      const key = commentsKey(entity);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CommentsData>(key);

      const now = new Date().toISOString();
      const temp: Comment = {
        id: `temp-${Date.now()}`,
        userId,
        text,
        isDeleted: false,
        likes: [],
        dislikes: [],
        childsCount: 0,
        childs: [],
        createDate: now,
        updateDate: now,
      };

      if (parentId) insertReply(queryClient, entity, parentId, temp);
      else updateCommentsCache(queryClient, entity, ([first = [], ...rest]) => [[temp, ...first], ...rest]);

      return { previous, tempId: temp.id };
    },

    onSuccess: (created, { entity }, ctx) => {
      if (ctx) updateCommentInCache(queryClient, entity, ctx.tempId, (temp) => ({ ...created, childs: temp.childs }));
    },

    onError: (error, { entity }, ctx) => {
      queryClient.setQueryData(commentsKey(entity), ctx?.previous);
      console.error("Failed to create comment:", error);
      toast.error("Не удалось отправить комментарий");
    },
  });
};
