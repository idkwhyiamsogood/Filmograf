import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { MovieCover, MovieSkeleton, movieApi, type IMovie } from "@/entities/movie";
import { searchApi } from "@/features/search";
import { Rail, SectionHeader } from "@/shared/components";

interface Props {
  movie: IMovie;
}

/**
 * «Похожие фильмы» — поиск по жанрам текущего фильма (POST /search/movies),
 * отдельной ручки рекомендаций по фильму на бэке нет.
 */
export const SimilarMovies: React.FC<Props> = ({ movie }) => {
  const queryClient = useQueryClient();

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["similar-movies", movie.id],
    enabled: movie.genreIds.length > 0,
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data } = await searchApi.searchMovies(
      "",
        { genres: { include: movie.genreIds, exclude: [] }, strictMatch: false },
        { page: 0, count: 13 },
      );
      const ids = (data.entityIds ?? []).filter((id) => id !== movie.id).slice(0, 12);
      if (!ids.length) return [];

      const { data: found } = await movieApi.batchMany({ ids });
      found.forEach((m) => queryClient.setQueryData(["movie", m.id], m));
      return ids
        .map((id) => found.find((m) => m.id === id))
        .filter((m): m is IMovie => Boolean(m));
    },
  });

  if (!isLoading && movies.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeader title="Похожие фильмы" />
      <Rail>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MovieSkeleton key={i} />)
          : movies.map((m) => <MovieCover key={m.id} movie={m} />)}
      </Rail>
    </section>
  );
};
