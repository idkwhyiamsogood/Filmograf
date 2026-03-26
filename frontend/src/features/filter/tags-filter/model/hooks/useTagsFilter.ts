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
          exclude: [...(prev.exclude || []), id],
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
  }, [updateFilterOption]);

  return {
    toggleTag,
    handleTagReset,
    getTagState,
  };
};
