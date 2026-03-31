import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { collecionTagsApi } from "../api/collection-tags.api";

interface Params {
  pageSize?: number;
  initialPage?: number;
}

export const useInfinityTags = ({
  pageSize = 21,
  initialPage = 0,
}: Params) => {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ["infinity-tags", pageSize],
    queryFn: async ({ pageParam = initialPage }) => {
      const response = await collecionTagsApi.getTags({
        page: pageParam,
        count: pageSize,
      });

      if (!response.data) throw new Error("Не удалось получить теги");

      const tags = response.data;

      tags.forEach((tag) => {
        queryClient.setQueryData(["tag", tag.id], tag);
      });

      const hasMore = tags.length === pageSize;
      return {
        tags,
        nextPage: hasMore ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: initialPage,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const allTags = query.data?.pages.flatMap((page) => page.tags) ?? [];

  return {
    ...query,
    tags: allTags,
    totalTags: allTags.length,
  };
};
