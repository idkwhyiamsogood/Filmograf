"use client";

// hooks
import { useState, useCallback } from "react";

// types
import { Tag } from "@/entities/collection-tags";

interface ReturnedProps {
  tagState: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tagId: string) => void;
  clearTags: () => void;
}

export const useTagCollector = (): ReturnedProps => {
  const [tagState, setTagState] = useState<Tag[]>([]);

  const addTag = useCallback((tag: Tag) => {
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
