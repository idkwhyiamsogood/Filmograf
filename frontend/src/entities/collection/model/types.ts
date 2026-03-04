import type { IComment } from "entities/comment";

export interface ICollection {
  id: number;
  label: string;
  // creator: (IUSER || number ? getUser() -> IUSER) || string  (NAME)
  // create: {id: string (uuid); name: string; icon: string (path to img)}
  totalGradeOut?: number; // user rate
  totalGradeIn?: number; // KP + IMDB return avg
  films?: number[]; // IFILM.id[]

  isPublic: boolean;
  isCommentable: boolean;

  comments?: IComment[]; // isCommentable false -> undefined;
};

export interface ICollectionRedact {
  id?: number; // optional type bsc can be deafaulted setted
  label: string;
  isPublic: boolean;
  isCommentable: boolean;
};
