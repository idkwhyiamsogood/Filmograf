import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api/movie.api";

export const useMyRates = () => {
  return useQuery({
    queryKey: ["rate-movie"],
    queryFn: async () => await movieApi.getMyRates(),
    select: (data) => data.data,
    staleTime: 10000,
  });
};
