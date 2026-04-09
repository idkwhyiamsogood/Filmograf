"use client";

import type { FC, ReactNode } from "react";
import type { Comment as CommentType } from "../model/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronRight, ThumbsDown, ThumbsUp } from "lucide-react";
import { CommentContent } from "./CommentContent";

import { useState } from "react";

import { INDENT_SIZE, MAX_VISIBLE_LEVEL } from "../model/constants/comments";
import { IUser } from "@/entities/user";
import { LoadingSplashScreen } from "@/shared/components";

interface Props {
  comment: CommentType;
  getUser: (userId: string) => IUser;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  resetReaction?: (commentId: string) => void;
  level?: number;
  onReply?: (commentId: string) => void;
  renderReplyEditor: (commentId: string) => ReactNode;
  updateWithChilds: (commentId: string) => void;
}

export const Comment: FC<Props> = ({
  comment,
  getUser,
  onLike,
  onDislike,
  resetReaction,
  level = 0,
  onReply,
  renderReplyEditor,
  updateWithChilds,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = comment.childs && comment.childs.length > 0;
  const childCount = comment.childsCount;

  const formattedDate = new Date(comment.createDate);
  const likesCount = comment.likes.length;
  const dislikesCount = comment.dislikes.length;

  const replyEditor = renderReplyEditor(comment.id);

  const user = getUser(comment.userId);

  return (
    <div className="relative">
      <div
        className="flex w-full gap-3"
        style={{
          marginLeft: level > 0 ? `${level * INDENT_SIZE}px` : 0,
        }}
      >
        <div className="flex flex-col gap-1 items-center">
          <Avatar className="size-10 flex-shrink-0">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formattedDate.toLocaleDateString()}
              </span>
            </div>

            <div className="text-sm leading-relaxed text-wrap">
              {comment.isDeleted ? (
                <span className="italic text-muted-foreground">
                  [Комментарий удален]
                </span>
              ) : (
                <CommentContent commentId={comment.id} content={comment.text} />
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs pl-0!"
                  onClick={() => {
                    comment.likes.includes(user.id)
                      ? onLike?.(comment.id)
                      : resetReaction?.(comment.id);
                  }}
                >
                  <ThumbsUp className="size-3.5" />
                  {likesCount > 0 && <span>{likesCount}</span>}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs px-2.5"
                  onClick={() => {
                    comment.likes.includes(user.id)
                      ? onDislike?.(comment.id)
                      : resetReaction?.(comment.id);
                  }}
                >
                  <ThumbsDown className="size-3.5" />
                  {dislikesCount > 0 && <span>{dislikesCount}</span>}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => {
                    onReply?.(comment.id);
                  }}
                >
                  Ответить
                </Button>
              </div>

              {childCount > 0 && level < MAX_VISIBLE_LEVEL && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5 text-xs text-muted-foreground px-2.5"
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    !isExpanded &&
                      !comment.childs &&
                      updateWithChilds(comment.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                  <span>
                    {isExpanded ? "Спрятать" : "Показать"}({childCount})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {replyEditor}

      {hasChildren && isExpanded && level < MAX_VISIBLE_LEVEL && (
        <div className="pt-3 space-y-3">
          {!comment.childs ? (
            <LoadingSplashScreen />
          ) : (
            comment.childs.map((child) => (
              <Comment
                key={child.id}
                comment={child}
                getUser={getUser}
                onLike={() => {
                  console.log("clicked");
                  onLike && onLike(child.id);
                }}
                onDislike={onDislike}
                onReply={onReply}
                level={level + 1}
                renderReplyEditor={renderReplyEditor}
                updateWithChilds={updateWithChilds}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
