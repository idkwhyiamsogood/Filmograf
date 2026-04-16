import { useCallback } from "react";
import { useFilter } from "@/features/filter/common";

export const useGenresFilter = () => {
  const { filterState, updateFilterOption } = useFilter();

  const getGenreState = useCallback(
    (genreId: string) => {
      const genres = filterState.filterOptions?.genres;

      if (!genres) return { checked: false, indeterminate: false };

      if (genres.includeIds?.includes(genreId)) {
        return { checked: true, indeterminate: false }; // галочка
      }

      if (genres.includeIds?.includes(genreId)) {
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
          return { includeIds: [id], excludeIds: [] };
        }

        const isInInclude = prev.includeIds?.includes(id);
        const isInExclude = prev.excludeIds?.includes(id);

        if (!isInInclude && !isInExclude) {
          // Состояние 1: unchecked → include (галочка)
          return {
            ...prev,
            includeIds: [...(prev.includeIds || []), id],
          };
        }

        if (isInInclude) {
          // Состояние 2: include → exclude (крестик)
          return {
            ...prev,
            includeIds: (prev.includeIds || []).filter(
              (genreId) => genreId !== id,
            ),
            excludeIds: [...(prev.excludeIds || []), id],
          };
        }

        // Состояние 3: exclude → unchecked (убираем)
        return {
          ...prev,
          excludeIds: (prev.excludeIds || []).filter(
            (genreId) => genreId !== id,
          ),
        };
      });
    },
    [updateFilterOption],
  );

  const handleGenresReset = useCallback(() => {
    updateFilterOption("genres", () => ({
      excludeIds: [],
      includeIds: [],
    }));
  }, [updateFilterOption]);

  return {
    toggleGenre,
    handleGenresReset,
    getGenreState,
  };
};
