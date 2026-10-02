import { useInfiniteQuery } from "@tanstack/react-query";
import type { Entity } from "@/shared/types";
import { commentApi } from "../api/comment.api";
import { COMMENTS_PAGE, commentsKey } from "../cache";

/** Корневые комментарии с подгрузкой «Показать ещё». */
export const useParentComment = (entity: Entity) => {
  const query = useInfiniteQuery({
    queryKey: commentsKey(entity),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      (
        await commentApi.getParentComments(entity.entityId, {
          page: pageParam,
          count: COMMENTS_PAGE,
          entityType: entity.type,
        })
      ).data,
    getNextPageParam: (last, all) => (last.length === COMMENTS_PAGE ? all.length : undefined),
    enabled: Boolean(entity.entityId && entity.type),
    staleTime: 30 * 1000,
  });

  return {
    data: query.data?.pages.flat() ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};
