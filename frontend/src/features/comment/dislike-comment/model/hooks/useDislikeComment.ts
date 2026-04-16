import type { Comment } from "@/entities/comment";
import { commentApi } from "@/entities/comment/model/api/comment.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleReaction } from "@/features/comment/common";

import type { ReactionProps } from "@/features/comment/common";
import { toast } from "sonner";

export const useDislikeComment = ({
  userId,
  entityType,
  entityId,
}: ReactionProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["parentComments", entityType, entityId];

  const updateRecursive = (
    comments: Comment[],
    targetId: string,
    uid: string,
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment.id === targetId) {
        return toggleReaction(comment, uid, "dislike");
      }

      if (comment.childs && comment.childs.length > 0) {
        return {
          ...comment,
          childs: updateRecursive(comment.childs, targetId, uid),
        };
      }

      return comment;
    });
  };

  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!userId) throw new Error("User is not authenticated");
      return commentApi.dislikeComment(commentId);
    },

    onMutate: async (commentId) => {
      if (!userId) return { previousComments: undefined };

      await queryClient.cancelQueries({ queryKey });
      const previousComments = queryClient.getQueryData<Comment[]>(queryKey);

      if (!previousComments) return { previousComments: undefined };

      queryClient.setQueryData<Comment[]>(queryKey, (old) => {
        if (!old) return [];
        return updateRecursive(old, commentId, userId);
      });

      return { previousComments };
    },

    onSuccess: () => {
      toast.success("Лайк поставлен");
    },

    onError: (err, commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(queryKey, context.previousComments);
      }

      toast.error("Произошла ошибка, попробуйте позже");
    },
  });
};
