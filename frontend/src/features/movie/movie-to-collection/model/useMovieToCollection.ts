import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  collectionApi,
  COLLECTION_QUERY_PREFIXES,
  updateCollectionInCache,
} from "@/entities/collection/";
import type { IMovie } from "@/entities/movie";
import { restoreSnapshot, snapshotQueries } from "@/shared/lib/query/entityCache";

import type { MutationPayload } from "./types";

export const useMovieToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["movieToCollection"],
    mutationFn: ({ movieId, collectionId, shouldAdd }: MutationPayload) =>
      shouldAdd
        ? collectionApi.addMovieToCollection(movieId, collectionId)
        : collectionApi.deleteMovieFromCollection(movieId, collectionId),

    // Галочка и счётчик фильмов меняются сразу во всех списках подборок,
    // обложка (первые 3 постера) — тоже.
    onMutate: async ({ movieId, collectionId, shouldAdd }) => {
      const snapshot = await snapshotQueries(queryClient, COLLECTION_QUERY_PREFIXES);
      const poster =
        queryClient.getQueryData<IMovie>(["movie", movieId])?.imageUrl ??
        queryClient.getQueryData<IMovie>(["movie-details", movieId])?.imageUrl;

      updateCollectionInCache(queryClient, collectionId, (c) => {
        const has = c.movies.includes(movieId);
        if (shouldAdd === has) return c;
        const movies = shouldAdd ? [...c.movies, movieId] : c.movies.filter((m) => m !== movieId);
        const moviePreviews =
          shouldAdd && poster && c.moviePreviews.length < 3
            ? [...c.moviePreviews, poster]
            : !shouldAdd && poster
              ? c.moviePreviews.filter((p) => p !== poster)
              : c.moviePreviews;
        return { ...c, movies, moviePreviews };
      });

      return { snapshot };
    },
    onSuccess: (_d, { shouldAdd }) => {
      toast.success(shouldAdd ? "Добавлено в подборку" : "Убрано из подборки");
    },
    onError: (_e, _v, ctx) => {
      restoreSnapshot(queryClient, ctx?.snapshot);
      toast.error("Не удалось обновить подборку, попробуйте позже");
    },
    onSettled: (_d, _e, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
    },
  });
};
