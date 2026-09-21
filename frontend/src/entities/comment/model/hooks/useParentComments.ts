import { useQuery } from "@tanstack/react-query";
import type { Entity } from "@/shared/types";
import { commentApi } from "../api/comment.api";

export const useParentComment = (entity: Entity) => {
  const { data, isLoading } = useQuery({
    queryKey: ["parentComments", entity.type, entity.entityId],
    queryFn: async () => {
      const response = await commentApi.getParentComments(entity.entityId, {
        page: 0,
        count: 10,
        entityType: entity.type,
      });
      
      return response.data;
    },
  });

  return {
    data: data || [],
    isLoading,
  };
};
