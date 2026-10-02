import type { FC } from "react";
import type { Comment as CommentType } from "../model/types";
import { Comment } from "./Comment";

export const CommentList: FC<{ comments: CommentType[] }> = ({ comments }) => (
  <div className="flex flex-col gap-5">
    {comments.map((comment) => (
      <Comment key={comment.id} comment={comment} />
    ))}
  </div>
);
