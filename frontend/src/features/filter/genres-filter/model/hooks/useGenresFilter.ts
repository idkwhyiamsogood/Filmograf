import { useCallback } from "react";
import { useFilter } from "@/features/filter/common";

export const useGenresFilter = () => {
  const { filterState, updateFilterOption } = useFilter();

  const getGenreState = useCallback(
    (genreId: string) => {
      const genres = filterState.filterOptions?.genres;

      if (!genres) return { checked: false, indeterminate: false };

      if (genres.include?.includes(genreId)) {
        return { checked: true, indeterminate: false }; // галочка
      }

      if (genres.exclude?.includes(genreId)) {
        return { checked: false, indeterminate: true }; // крестик
      }

      return { checked: false, indeterminate: false }; // unchecked
    },
    [filterState.filterOptions?.genres],
  );

  const toggleGenre = useCallback(
    (id: string) => {
      updateFilterOption("genres", (prev) => {
        if (!prev) {
          // Первый клик: добавляем в include
          return { include: [id], exclude: [] };
        }

        const isInInclude = prev.include?.includes(id);
        const isInExclude = prev.exclude?.includes(id);

        if (!isInInclude && !isInExclude) {
          // Состояние 1: unchecked → include (галочка)
          return {
            ...prev,
            include: [...(prev.include || []), id],
          };
        }

        if (isInInclude) {
          // Состояние 2: include → exclude (крестик)
          return {
            ...prev,
            include: (prev.include || []).filter((genreId) => genreId !== id),
            exclude: [...(prev.exclude || []), id],
          };
        }

        // Состояние 3: exclude → unchecked (убираем)
        return {
          ...prev,
          exclude: (prev.exclude || []).filter((genreId) => genreId !== id),
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
