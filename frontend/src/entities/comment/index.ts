export type { Comment, CreateComment } from "./model/types";

export { CommentList } from "./ui/CommentList";
export { CommentSkeleton } from "./ui/CommentSkeleton";

// mock
export { mockCommentsWithReplies } from "./model/mock/comments";


// hooks
export { useChildsComment } from "./model/hooks/useChildsComment";
export { useParentComment } from "./model/hooks/useParentComments";