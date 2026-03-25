import type { QueryParams, EntityType, BaseModel } from "@/shared/types";

export interface Comment extends BaseModel {
  userId: string;
  text: string;
  isDeleted: boolean;
  likes: string[];
  dislikes: string[];
  childsCount: number; // 0 if null
  childs: Comment[] | null;
}

export type CreateComment = {
  text: string;
};

export interface CommentQueryParams extends QueryParams {
  entityType: EntityType;
};