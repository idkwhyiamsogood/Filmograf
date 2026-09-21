import { BaseHttpClient } from "@/shared/lib/http/axios";
import { APIResponse } from "@/shared/types/api";

import type { Comment, CreateComment, CommentQueryParams } from "../types";
import type { EntityType } from "@/shared/types";

class CommentApi extends BaseHttpClient {
  public editCommentText = async (
    commentId: string,
    data: CreateComment,
  ): APIResponse<null> => {
    return this.patch(`api/comments/${commentId}`, data);
  };

  /**
   * @param {string} id - Идентификатор корневого комментария
   * @returns {APIResponse<Comment[]>} отец и дети
   */
  public getCommentsWithChilds = async (id: string): APIResponse<Comment[]> => {
    return this.get(`api/comments/${id}/full`);
  };

  public createComment = async (
    entityId: string,
    entityType: EntityType,
    data: CreateComment,
  ): APIResponse<Comment> => {
    return this.post(
      `api/comments/entities/${entityId}/comment?EntityType=${entityType}`,
      data,
    );
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

  public getParentComments = async (
    entityId: string,
    params: CommentQueryParams = { page: 0, count: 5, entityType: "Movie" },
  ): APIResponse<Comment[]> => {
    return this.get(
      `api/comments/entities/${entityId}?Page=${params.page}&Count=${params.count}&EntityType=${params.entityType}`,
    );
  };

  public likeComment = async (commentId: string): APIResponse<null> => {
    return this.put(`api/comments/${commentId}/reaction`, { reaction: 1 });
  };

  public dislikeComment = async (commentId: string): APIResponse<null> => {
    return this.put(`api/comments/${commentId}/reaction`, { reaction: -1 });
  };

  public clearReaction = async (commentId: string): APIResponse<null> => {
    return this.put(`api/comments/${commentId}/reaction`, { reaction: 0 });
  };
}

export const commentApi = new CommentApi();
