"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieApi } from "../api/film.api";

export const useTopMovies = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["top"],
    queryFn: async () => await movieApi.getTop(),
  });
};
