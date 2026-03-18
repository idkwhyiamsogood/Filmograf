import { BaseHttpClient } from "@/shared/lib";
import { ApiResponse } from "@/shared/types/api";

import type { Comment, CreateComment } from "../types";

// todo

class CommentApi extends BaseHttpClient {
  public getCommentWithoutChilds = async (id: string): ApiResponse<Comment> => {
    return this.get(`api/comments/${id}`);
  };

  public editCommentText = async (
    text: string,
    id: string,
  ): ApiResponse<null> => {
    return this.patch(`api/comments/${id}`, text);
  };

  public deleteComment = async (id: string): ApiResponse<null> => {
    return this.delete(`api/comments/${id}`);
  };

  public getCommentsWithChilds = async (id: string): ApiResponse<Comment[]> => {
    return this.get(`api/comments/${id}/full`);
  };

  public createChildComment = async (
    parentId: string,
    comment: CreateComment,
  ): ApiResponse<Comment> => {
    return this.post(`api/comments/${parentId}/comment`, comment);
  };
}

export const commentApi = new CommentApi();
