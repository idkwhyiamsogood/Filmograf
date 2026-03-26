import { useQuery } from "@tanstack/react-query";
import { genreApi } from "../api/genres.api";

export const useGenres = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => genreApi.getGenres(),
    staleTime: Infinity,
  });

  return {
    data: data?.data || [],
    isLoading
  }
};