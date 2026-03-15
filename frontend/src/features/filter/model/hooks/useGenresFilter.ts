import { useCallback } from "react";
import { useFilter } from "./useFilter";

export const useGenresFilter = () => {
  const { filterState, updateFilterOption } = useFilter();

  const getGenreState = useCallback(
    (genreId: string) => {
      const genres = filterState.filterOptions?.genres;

      if (!genres) return { checked: false, indeterminate: false };

      if (genres.include?.includes(genreId)) {
        return { checked: true, indeterminate: false };
      }

      if (genres.exclude?.includes(genreId)) {
        return { checked: false, indeterminate: true };
      }

      return { checked: false, indeterminate: false };
    },
    [filterState.filterOptions?.genres],
  );

  const toggleGenre = useCallback(
    (id: string) => {
      updateFilterOption("genres", (prev) => {
        if (!prev) {
          return { exclude: [], include: [id] };
        }

        if (prev.include?.includes(id)) {
          return {
            ...prev,
            include: prev.include.filter((genreId) => genreId !== id),
          };
        }

        if (prev.exclude?.includes(id)) {
          return {
            exclude: prev.exclude.filter((genreId) => genreId !== id),
            include: [...(prev.include || []), id],
          };
        }

        return {
          ...prev,
          include: [...(prev.include || []), id],
        };
      });
    },
    [updateFilterOption],
  );

  const handleGenresReset = useCallback(() => {
    updateFilterOption("genres", () => ({
      exclude: [],
      include: [],
    }));
  }, [updateFilterOption]);

  return {
    toggleGenre,
    handleGenresReset,
    getGenreState,
  };
};
