import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../api/comment.api";
import type { Comment } from "../types";
import type { Entity } from "@/shared/types";

export const useChildsComment = ({ entityId, type }: Entity) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await commentApi.getCommentsWithChilds(commentId);
      return { commentId, updatedComment: response.data };
    },
    onSuccess: ({ commentId, updatedComment }) => {
      const queryKey = ["parentComments", type, entityId];

      queryClient.setQueryData(queryKey, (oldData: Comment[] | undefined) => {
        if (!oldData) return [];

        const updateRecursive = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, ...updatedComment };
            }
            if (comment.childs && comment.childs.length > 0) {
              return { ...comment, childs: updateRecursive(comment.childs) };
            }
            return comment;
          });
        };

        const newData = updateRecursive(oldData);
        console.log("New Cache Data:", newData);
        return newData;
      });
    },
  });
};
