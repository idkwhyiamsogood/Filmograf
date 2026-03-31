import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { collecionTagsApi } from "../api/collection-tags.api";
import { useTags } from "./useTags";

export const useTagsSearch = (query: string) => {
  const searchQuery = useQuery({
    queryKey: ["tags", "search-ids", query],
    queryFn: async () => {
      if (!query) return [];
      const { data } = await collecionTagsApi.searchTags(query);
      return data?.entityIds || [];
    },
    staleTime: 0, 
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
  });

  const foundIds = searchQuery.data || [];

  const tagsQuery = useTags(foundIds);

  return {
    ...tagsQuery,
    isLoading: searchQuery.isLoading || tagsQuery.isLoading,
    isError: searchQuery.isError || tagsQuery.isError,
  };
};
