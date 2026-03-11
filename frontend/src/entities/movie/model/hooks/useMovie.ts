import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/film.api";

import type { IMovie } from "../types/types";
import { useCallback } from "react";

// aka movieStore по русски

const movieKeys = {
  all: ["movies"],
  detail: (id: string) => ["movies", id],
  list: () => ["movies", "list"],
};

export function useMovie(id?: string) {
  const queryClient = useQueryClient();

  const getMovieById = useCallback(async (id: string) => {
    try {
      const { data } = await movieApi.getMovie(id);
      return data;
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getMovie = () => {
    {
      const cachedMovie = queryClient.getQueryData<IMovie>(
        movieKeys.detail(id as string),
      );

      if (cachedMovie) {
        console.log(`Фильм ${id} найден в кэше`);
        return cachedMovie;
      }

      const movie = getMovieById(id as string);
      console.log(`Запрашиваем фильм ${id} с бекенда`);

      return movie;
    }
  }

  return useQuery({
    queryKey: movieKeys.detail(id as string),
    queryFn: () => getMovie(),

    staleTime: 5 * 60 * 1000, // Данные считаются свежими 5 минут
    gcTime: 5 * 60 * 1000, // Данные хранятся в кэше 5 минут после последнего использования

    refetchOnMount: false,
    refetchOnWindowFocus: false,

    initialData: () => {
      const movies = queryClient.getQueryData<IMovie[]>(movieKeys.list());
      return movies?.find((m) => m.id === id);
    },

    initialDataUpdatedAt: () =>
      queryClient.getQueryState(movieKeys.list())?.dataUpdatedAt,
  });
}