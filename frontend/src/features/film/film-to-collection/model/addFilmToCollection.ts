"use client";

import type { ICollection } from "entities/collection";

import { useCollections } from "entities/collection";

export const addFilmToCollection = (
  filmId: number,
  collection: ICollection,
) => {
  const { updateCollection } = useCollections();

  updateCollection(collection.id, {
    films: [...(collection.films || []), filmId],
  });
};

