import type { Comment as CommentType } from "../model/types";
import { Comment } from "./Comment";
import { CommentSkeleton } from "./CommentSkeleton";

interface Props {
  comments: CommentType[];
  getUserName: (userId: string) => string;
  getUserAvatar: (userId: string) => string | undefined;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
}

export const CommentWrapper: React.FC<Props> = ({
  comments,
  getUserName,
  getUserAvatar,
  onLike,
  onDislike,
  onReply,
}) => {
  if (!comments) {
    return (
      <div className="space-y-4">
        <CommentSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          authorName={getUserName(comment.userId)}
          authorAvatar={getUserAvatar(comment.userId)}
          onLike={onLike}
          onDislike={onDislike}
          onReply={onReply}
          level={0}
        />
      ))}
    </div>
  );
};
