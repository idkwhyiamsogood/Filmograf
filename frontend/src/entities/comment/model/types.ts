import type { BaseModel } from "@/shared/types";

export interface Comment extends BaseModel {
  userId: string;
  text: string;
  isDeleted: boolean;
  liked: string[];
  dislikes: string[];
  childs: Comment[] | null;
}

// export interface CommentFull extends Comment {
//   childs: 
// }

export type CreateComment = {
  text: string;
};
