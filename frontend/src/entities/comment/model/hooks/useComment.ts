import { useQuery } from "@tanstack/react-query";
import { commentApi } from "../api/comment.api";

export const useComment = (commentId: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async () => (await commentApi.getComment(commentId)).data,
    staleTime: 60 * 1000,
    ...options,
  });
};
