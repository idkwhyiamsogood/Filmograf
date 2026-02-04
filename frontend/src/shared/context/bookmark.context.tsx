"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface IBookmark {
  id: number;
  label: string;
}

export interface BookmarkContextType {
  bookmarks: IBookmark[];
  createBookmark: (label: string) => void;
  deleteBookmark: (id: number) => void;
  updateBookmark: (id: number, newLabel: string) => void;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([
    { id: 0, label: "Все"}
  ]);

  const createBookmark = (label: string) => {
    const newBookmark: IBookmark = {
      id: bookmarks[0].id + 1, // autoincrement по русски
      label: label,
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  const deleteBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const updateBookmark = (id: number, newLabel: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, label: newLabel } : bookmark,
      ),
    );
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, createBookmark, deleteBookmark, updateBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
