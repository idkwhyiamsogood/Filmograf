import type { BaseModel } from "@/shared/types";

export interface Collection extends BaseModel {
  name: string;
  sourceCollectionId: string;
  userId: string;
  movies: string[];
  moviePreviews: string[];
  tags: string[];
  isPublic: boolean;
  isCommentable: boolean;
  isCopiable: boolean;
  isByFilmograf: boolean;
  isDeleted: boolean;
};

export interface CreateCollection {
  name: string;
  tags: string[];
  isPublic: boolean;
  isCommentable: boolean;
  isCopiable: boolean;
};

export type UpdateCollection = {
  id: string;
  data: CreateCollection
};