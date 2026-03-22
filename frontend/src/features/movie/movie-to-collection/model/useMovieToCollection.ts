import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionApi } from "@/entities/collection/";
import type { Collection } from "@/entities/collection/";

import type { MutationPayload, MutationContext } from "./types";

export const useMovieToCollection = () => {
  const queryClient = useQueryClient();

  const patchCollectionMovies = (
    collection: Collection,
    movieId: string,
    shouldAdd: boolean,
  ): Collection => {
    const movies = collection.movies || [];
    const hasMovie = movies.includes(movieId);

    if (shouldAdd && !hasMovie) {
      return { ...collection, movies: [...movies, movieId] };
    }

    if (!shouldAdd && hasMovie) {
      return {
        ...collection,
        movies: movies.filter((id) => id !== movieId),
      };
    }

    return collection;
  };

  return useMutation({
    mutationKey: ["movieToCollection"],
    mutationFn: ({ movieId, collectionId, shouldAdd }: MutationPayload) => {
      if (shouldAdd) {
        return collectionApi.addMovieToCollection(movieId, collectionId);
      }

      return collectionApi.deleteMovieFromCollection(movieId, collectionId);
    },
    onMutate: async ({
      movieId,
      collectionId,
      shouldAdd,
    }: MutationPayload): Promise<MutationContext> => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["collection", collectionId] }),
        queryClient.cancelQueries({ queryKey: ["collections"], exact: false }),
      ]);

      const previousCollection = queryClient.getQueryData<Collection>([
        "collection",
        collectionId,
      ]);
      const previousCollectionsLists = queryClient.getQueriesData<
        Collection[] | null
      >({
        queryKey: ["collections"],
      });

      if (previousCollection) {
        queryClient.setQueryData<Collection>(["collection", collectionId], () =>
          patchCollectionMovies(previousCollection, movieId, shouldAdd),
        );
      }

      queryClient.setQueriesData<Collection[] | null>(
        { queryKey: ["collections"] },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return oldData.map((collection) =>
            collection.id === collectionId
              ? patchCollectionMovies(collection, movieId, shouldAdd)
              : collection,
          );
        },
      );

      return { previousCollection, previousCollectionsLists };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      if (context.previousCollection) {
        queryClient.setQueryData(
          ["collection", variables.collectionId],
          context.previousCollection,
        );
      }

      for (const [queryKey, data] of context.previousCollectionsLists) {
        queryClient.setQueryData(queryKey, data);
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["collection", variables.collectionId],
      });
      queryClient.invalidateQueries({ queryKey: ["collections"], exact: false });
    },
  });
};