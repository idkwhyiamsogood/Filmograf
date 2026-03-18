import { useQuery } from "@tanstack/react-query";

import { genreApi } from "../api/genres.api";

export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => genreApi.getGenres(),
    staleTime: Infinity, 
  });
};