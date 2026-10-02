import { createContext, useContext, type ReactNode } from "react";
import type { Comment } from "../model/types";

export type CommentReaction = "like" | "dislike" | null;

/**
 * Действия и состояние ветки обсуждения. Провайдер — в виджете обсуждения
 * (там живут мутации), сам Comment только рисует и вызывает колбэки.
 */
export interface CommentThreadValue {
  currentUserId?: string;
  replyingTo: string | null;
  editingId: string | null;
  loadingRepliesId: string | null;
  react: (comment: Comment, reaction: CommentReaction) => void;
  startReply: (commentId: string) => void;
  startEdit: (commentId: string) => void;
  remove: (commentId: string) => void;
  loadReplies: (commentId: string) => void;
  openAuthor: (userId: string) => void;
  renderReplyComposer: (parent: Comment) => ReactNode;
  renderEditComposer: (comment: Comment) => ReactNode;
}

export const CommentThreadContext = createContext<CommentThreadValue | null>(null);

export const useCommentThread = () => {
  const ctx = useContext(CommentThreadContext);
  if (!ctx) throw new Error("Comment должен быть внутри CommentThreadContext");
  return ctx;
};
