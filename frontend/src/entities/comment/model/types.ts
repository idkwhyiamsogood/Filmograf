import type { QueryParams, EntityType, BaseModel } from "@/shared/types";

export interface Comment extends BaseModel {
  userId: string;
  text: string;
  isDeleted: boolean;
  liked: string[];
  dislikes: string[];
  childs: Comment[] | null;
}

export type CreateComment = {
  text: string;
};

export interface CommentQueryParams extends QueryParams {
  entityType: EntityType;
}
