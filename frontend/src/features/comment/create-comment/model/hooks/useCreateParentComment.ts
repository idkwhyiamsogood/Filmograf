import type { Comment as CommentType, CreateComment } from "@/entities/comment";
import type { Entity } from "@/shared/types";

import { commentApi } from "@/entities/comment/model/api/comment.api";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

interface CreateParentCommentParams {
  entity: Entity;
  data: CreateComment;
}

export const useCreateParentComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entity, data }: CreateParentCommentParams) => {
      const response = await commentApi.createComment(
        entity.entityId,
        entity.type,
        data,
      );
      console.log(response);
      return response.data;
    },

    onMutate: async (variables) => {
      const queryKey = [
        "parentComments",
        variables.entity.type,
        variables.entity.entityId,
      ] as const;

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousComments =
        queryClient.getQueryData<CommentType[]>(queryKey);

      queryClient.setQueryData<CommentType[]>(queryKey, (oldData) => {
        const previousList = oldData ?? [];
        const now = new Date().toISOString();

        const optimisticComment: CommentType = {
          ...(variables.data as CreateComment),
          id: `temp-${Date.now()}`,
          createDate: now,
          updateDate: now,
          userId: "",
          isDeleted: false,
          likes: [],
          dislikes: [],
          childsCount: 0,
          childs: null,
        } as CommentType;

        return [optimisticComment, ...previousList];
      });

      return { previousComments };
    },

    onSuccess: (newComment: CommentType, variables, context) => {
      const queryKey = [
        "parentComments",
        variables.entity.type,
        variables.entity.entityId,
      ] as const;

      queryClient.setQueryData<CommentType[]>(queryKey, (oldData) => {
        const previousList = oldData ?? [];

        return previousList.map((comment) =>
          String(comment.id).startsWith("temp-") ? newComment : comment,
        );
      });

      toast.success("Комментарий успешно создан");
    },

    onError: (error, variables, context) => {
      console.error("Failed to create comment:", error);

      if (context?.previousComments) {
        const queryKey = [
          "parentComments",
          variables.entity.type,
          variables.entity.entityId,
        ] as const;

        queryClient.setQueryData(queryKey, context.previousComments);
      }

      toast.error("При создании комментарии произошла ошибка");
    },
  });
};
