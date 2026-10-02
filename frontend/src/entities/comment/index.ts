export type { Comment, CreateComment } from "./model/types";

export { CommentList } from "./ui/CommentList";
export { CommentSkeleton } from "./ui/CommentSkeleton";
export {
  CommentThreadContext,
  type CommentThreadValue,
  type CommentReaction,
} from "./ui/thread.context";



// hooks
export { useChildsComment } from "./model/hooks/useChildsComment";
export { useParentComment } from "./model/hooks/useParentComments";
export { useComment } from "./model/hooks/useComment";

// api
export { commentApi } from "./model/api/comment.api";
// cache
export {
  commentsKey,
  updateCommentInCache,
  updateCommentsCache,
  insertReply,
  updateInTree,
  type CommentsData,
} from "./model/cache";
