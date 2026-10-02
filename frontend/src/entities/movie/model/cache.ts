import type { QueryClient } from "@tanstack/react-query";
import { updateEntityEverywhere, type EntityUpdater } from "@/shared/lib/query/entityCache";
import type { IMovie } from "./types/types";

/** Все ключи, где может лежать фильм. */
export const MOVIE_QUERY_PREFIXES = [
  "movie",
  "movie-details",
  "movies",
  "infinite-movies",
  "search-infinite-movies",
  "similar-movies",
];

export const updateMovieInCache = (qc: QueryClient, id: string, fn: EntityUpdater<IMovie>) =>
  updateEntityEverywhere<IMovie>(qc, MOVIE_QUERY_PREFIXES, id, fn);
