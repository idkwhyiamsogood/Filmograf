import { useCallback } from "react";
import { useFilter } from "@/features/filter/common";

export const useTagsFilter = () => {
  const { filterState, updateFilterOption } = useFilter();

  const getTagState = useCallback(
    (tagId: string) => {
      const tags = filterState.filterOptions?.tags;

      if (!tags) return { checked: false, indeterminate: false };

      if (tags.includeIds?.includes(tagId)) {
        return { checked: true, indeterminate: false };
      }

      if (tags.excludeIds?.includes(tagId)) {
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
            includeIds: (prev.includeIds || []).filter((genreId) => genreId !== id),
            excludeIds: [...(prev.excludeIds || []), id],
          };
        }

        // Состояние 3: exclude → unchecked (убираем)
        return {
          ...prev,
          exclude: (prev.excludeIds || []).filter((genreId) => genreId !== id),
        };
      });
    },
    [updateFilterOption],
  );

  const handleTagReset = useCallback(() => {
    updateFilterOption("tags", () => ({
      excludeIds: [],
      includeIds: [],
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
