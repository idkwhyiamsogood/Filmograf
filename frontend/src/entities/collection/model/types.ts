import { IComment } from "entities/comment";


export interface ICollection {
  name: string;
  // creator: (IUSER || number ? getUser() -> IUSER) || string  (NAME)
  // create: {id: string (uuid); name: string; icon: string (path to img)}
  totalGradeOut: number;
  totalGradeIn: number; // KP + IMDB return avg
  items: number; // IFILM.id[]

  isPublic: boolean;
  isCommentable: boolean;

  comments: IComment[] | null; // isCommentable false -> null;
}