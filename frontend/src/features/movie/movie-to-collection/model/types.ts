import type { Collection } from "@/entities/collection";

export type MutationPayload = {
  movieId: string;
  collectionId: string;
  shouldAdd: boolean;
};

export type MutationContext = {
  previousCollection?: Collection;
  previousCollectionsLists: [
    readonly unknown[],
    Collection[] | null | undefined,
  ][];
};
