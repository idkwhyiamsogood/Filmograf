import type { ReactNode } from "react";
import type { Comment as CommentType } from "../model/types";
import { Comment } from "./Comment";
import type { IUser, UserLight } from "@/entities/user";

interface Props {
  comments: CommentType[];
  getUser: (userId: string) => Promise<UserLight>;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  resetReaction?: (commentId: string) => void;
  renderReplyEditor: (commentId: string) => ReactNode;
  updateWithChilds: (commentId: string) => void;
}

export const CommentList: React.FC<Props> = ({
  comments,
  getUser,
  onLike,
  onDislike,
  resetReaction,
  onReply,
  renderReplyEditor,
  updateWithChilds,
}) => {
  return (
    <div className="space-y-4">
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          getUser={getUser}
          onLike={onLike}
          onDislike={onDislike}
          resetReaction={resetReaction}
          onReply={onReply}
          renderReplyEditor={renderReplyEditor}
          level={0}
          updateWithChilds={updateWithChilds}
        />
      ))}
    </div>
  );
};
