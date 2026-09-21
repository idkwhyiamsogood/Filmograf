import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/entities/comment/model/api/comment.api";
import type { Entity } from "@/shared/types";
import type { Comment, CreateComment } from "@/entities/comment";
import { toast } from "sonner";

interface CreateChildCommentParams {
  parentCommentId: string;
  entity: Entity;
  data: CreateComment;
}

export const useCreateChildComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      parentCommentId,
      data,
    }: CreateChildCommentParams): Promise<Comment> => {
      const response = await commentApi.createChildComment(
        parentCommentId,
        data,
      );
      return (response as any).data.data || (response as any).data;
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: [
          "parentComments",
          variables.entity.type,
          variables.entity.entityId,
        ],
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "parentComments",
        variables.entity.type,
        variables.entity.entityId,
      ]);

      const optimisticComment: Comment = {
        id: `temp-${Date.now()}-${Math.random()}`,
        userId: "unknown",
        text: variables.data.text,
        isDeleted: false,
        likes: [],
        dislikes: [],
        childsCount: 0,
        childs: null,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
      };

      queryClient.setQueryData<Comment[]>(
        ["parentComments", variables.entity.type, variables.entity.entityId],
        (oldComments) => {
          if (!oldComments) return [optimisticComment];

          return oldComments.map((comment): Comment => {
            if (comment.id === variables.parentCommentId) {
              return {
                ...comment,
                childsCount: comment.childsCount + 1,
                childs: comment.childs
                  ? [optimisticComment, ...comment.childs]
                  : [optimisticComment],
              };
            }
            return comment;
          });
        },
      );

      return { previousComments, optimisticCommentId: optimisticComment.id };
    },

    onSuccess: (newComment, variables, context) => {
      queryClient.setQueryData<Comment[]>(
        ["parentComments", variables.entity.type, variables.entity.entityId],
        (oldComments) => {
          if (!oldComments) return oldComments;

          return oldComments.map((comment): Comment => {
            if (comment.id === variables.parentCommentId && comment.childs) {
              return {
                ...comment,
                childs: comment.childs.map((child) =>
                  child.id === context?.optimisticCommentId
                    ? newComment
                    : child,
                ),
              };
            }
            return comment;
          });
        },
      );

      toast.success("Комментарий успешно добавлен");
    },

    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["parentComments", variables.entity.type, variables.entity.entityId],
          context.previousComments,
        );
      }

      console.error("Failed to create child comment:", error);
      toast.error("Не удалось добавить комментарий");
    },
  });
};
