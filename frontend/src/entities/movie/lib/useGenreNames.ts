import { useMemo } from "react";
import { useGenres } from "@/entities/genres";

/** id жанров → названия (справочник жанров кэшируется навсегда). */
export const useGenreNames = (ids: string[] = [], limit?: number) => {
  const { data: genres } = useGenres();

  return useMemo(() => {
    const names = ids
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter((n): n is string => Boolean(n));
    return limit ? names.slice(0, limit) : names;
  }, [ids, genres, limit]);
};
