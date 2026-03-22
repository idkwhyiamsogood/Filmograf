import { BaseHttpClient } from "@/shared/lib";
import { APIResponse } from "@/shared/types/api";

import type { Comment, CreateComment, CommentQueryParams } from "../types";

class CommentApi extends BaseHttpClient {
  public editCommentText = async (
    commentId: string,
    data: CreateComment,
  ): APIResponse<null> => {
    return this.patch(`api/comments/${commentId}`, data);
  };

  public getCommentsWithChilds = async (id: string): APIResponse<Comment[]> => {
    return this.get(`api/comments/${id}/full`);
  };

  public createComment = async (
    entityId: string,
    data: CreateComment,
  ): APIResponse<Comment> => {
    return this.post(`api/comments/${entityId}/comment`, data);
  };

  public createChildComment = async (
    commentId: string,
    data: CreateComment,
  ): APIResponse<Comment> => {
    return this.post(`api/comments/${commentId}/comment`, data);
  };

  public deleteComment = async (commentId: string): APIResponse<null> => {
    return this.delete(`api/comments/${commentId}`);
  };

  public getComments = async (
    entityId: string,
    params: CommentQueryParams,
  ): APIResponse<Comment[]> => {
    return this.get(
      `api/comments/entities/${entityId}?Page=${params.page}&Count=${params.count}&EntityType=${params.entityType}`,
    );
  };

  public likeComment = async (commentId: string): APIResponse<null> => {
    return this.put(`api/comments/${commentId}/reaction`, { reaction: 1 });
  };

  public dislikeComment = async (commentId: string): APIResponse<null> => {
    return this.put(`api/comments/${commentId}/reaction`, { reaction: 0 });
  };
}

export const commentApi = new CommentApi();
