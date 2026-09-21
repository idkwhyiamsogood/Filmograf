// hooks
import { useState, useCallback } from "react";

// types
import { TagType } from "@/entities/collection-tags";

interface ReturnedProps {
  tagState: TagType[];
  addTag: (tag: TagType) => void;
  removeTag: (tagId: string) => void;
  clearTags: () => void;
}

export const useTagCollector = (): ReturnedProps => {
  const [tagState, setTagState] = useState<TagType[]>([]);

  const addTag = useCallback((tag: TagType) => {
    return setTagState((prev) => [...prev, tag]);
  }, []);

  const removeTag = useCallback((tagId: string) => {
    return setTagState((prev) => prev.filter((prev) => prev.id !== tagId));
  }, []);

  const clearTags = useCallback(() => {
    return setTagState([]);
  }, []);

  return {
    tagState,
    addTag,
    removeTag,
    clearTags,
  };
};
