import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "../api/collection.api";
import type { Collection } from "../types";

export const useCollections = (ids: string[] | string) => {
  const queryClient = useQueryClient();

  const getCollections = async (ids: string[] | string) => {
    if (Array.isArray(ids)) {
      const missing: string[] = [];
      const answer: Collection[] = [];

      for (const id of ids) {
        const item = queryClient.getQueryData<Collection>(["collection", id]);

        if (item) answer.push(item);
        else missing.push(id);
      }

      if (missing.length === 0) {
        return answer;
      }

      const { data: missingCollections } = await collectionApi.batchMany({
        ids: missing,
      });

      if (missingCollections) {
        missingCollections.forEach((collection) => {
          queryClient.setQueryData(["collection", collection.id], collection);
        });

        return answer.concat(missingCollections);
      }

      return null;
    } else {
      const cachedCollection = queryClient.getQueryData<Collection>(["collection", ids]);

      if (cachedCollection) {
        return [cachedCollection];
      }

      const { data: collection } = await collectionApi.getCollection(ids);

      if (collection) {
        queryClient.setQueryData(["collection", ids], collection);
        return [collection];
      }

      return null;
    }
  };

  return useQuery({
    queryKey: ["collections", Array.isArray(ids) ? ids.sort() : ids],
    queryFn: () => getCollections(ids),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};