"use client";

import {
  createContext,
  useCallback,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { ICollection, ICollectionRedact } from "entities/collection/";

export interface CollectionContextType {
  collections: ICollection[];
  createCollection: (data: ICollectionRedact) => void;
  deleteCollection: (id: number) => void;
  updateCollection: (id: number, data: Partial<ICollection>) => void;

  setCollections: Dispatch<SetStateAction<ICollection[]>>;
}

export const CollectionContext = createContext<
  CollectionContextType | undefined
>(undefined);

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<ICollection[]>([
    {
      id: 0,
      label: "Все",
      isPublic: false,
      isCommentable: false,
      films: [0, 0, 0, 0, 0, 0],
    },
  ]);

  const createCollection = useCallback((data: ICollectionRedact) => {
    setCollections((prev) => {
      const lastId = prev.length > 0 ? prev[prev.length - 1].id : 0;

      const newCollection: ICollection = {
        id: lastId + 1,
        label: data.label,
        isPublic: data.isPublic || false,
        isCommentable: data.isCommentable || false,
        films: [],
      };

      return [...prev, newCollection];
    });
  }, []);

  const deleteCollection = useCallback((id: number) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
  }, []);

  const updateCollection = useCallback(
    (id: number, data: Partial<ICollection>) => {
      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === id ? { ...collection, ...data } : collection,
        ),
      );
    },
    [],
  );

  return (
    <CollectionContext.Provider
      value={{
        collections,
        createCollection,
        deleteCollection,
        updateCollection,
        setCollections,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
