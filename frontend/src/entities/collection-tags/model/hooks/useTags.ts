import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collecionTagsApi } from "../api/collection-tags.api";
import type { Tag } from "../types";

export const useTags = (ids: string[] | string) => {
  const queryClient = useQueryClient();
  const idArray = Array.isArray(ids) ? ids : [ids];
  const sortedIds = [...idArray].sort();

  return useQuery({
    queryKey: ["tags", "batch", sortedIds],
    queryFn: async () => {
      const result: Tag[] = [];
      const missing: string[] = [];

      idArray.forEach((id) => {
        const cached = queryClient.getQueryData<Tag>(["tag", id]);
        if (cached) result.push(cached);
        else missing.push(id);
      });

      if (missing.length === 0) return result;

      const { data: missingTags } = await collecionTagsApi.batchMany(missing);

      if (missingTags) {
        missingTags.forEach((tag) => {
          queryClient.setQueryData(["tag", tag.id], tag);
        });
        result.push(...missingTags);
      }

      return result;
    },
    staleTime: 10 * 60 * 1000,
  });
};
