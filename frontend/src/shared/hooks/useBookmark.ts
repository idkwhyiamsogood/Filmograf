import { useContext } from "react";

import { BookmarkContext, BookmarkContextType } from "../context/bookmark.context";

export const useBookmarks = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
