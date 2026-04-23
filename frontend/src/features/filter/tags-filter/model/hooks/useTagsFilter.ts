import { useCallback } from "react";
import { useFilter } from "@/features/filter/common";

export const useTagsFilter = () => {
  const { filterState, updateFilterOption } = useFilter();

  const getTagState = useCallback(
    (tagId: string) => {
      const tags = filterState.filterOptions?.tags;

      if (!tags) return { checked: false, indeterminate: false };

      if (tags.include?.includes(tagId)) {
        return { checked: true, indeterminate: false };
      }

      if (tags.exclude?.includes(tagId)) {
        return { checked: false, indeterminate: true };
      }

      return { checked: false, indeterminate: false };
    },
    [filterState.filterOptions?.tags],
  );

  const toggleTag = useCallback(
    (id: string) => {
      updateFilterOption("tags", (prev) => {
        if (!prev) {
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
            include: (prev.include || []).filter(
              (genreId) => genreId !== id,
            ),
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

  const handleTagReset = useCallback(() => {
    updateFilterOption("tags", () => ({
      exclude: [],
      include: [],
    }));

    // dev only
    // console.log("updated")
  }, [updateFilterOption]);

  return {
    toggleTag,
    handleTagReset,
    getTagState,
  };
};
