"use client";

import type { FC } from "react";
import type { Comment as CommentType } from "../model/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { ChevronDown, ChevronRight, ThumbsDown, ThumbsUp } from "lucide-react";

import { useState } from "react";

import { INDENT_SIZE, MAX_VISIBLE_LEVEL } from "../model/constants/comments";

interface Props {
  comment: CommentType;
  authorName: string;
  authorAvatar?: string;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  level?: number;
};

export const Comment: FC<Props> = ({
  comment,
  authorName,
  authorAvatar,
  onLike,
  onDislike,
  onReply,
  level = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = comment.childs && comment.childs.length > 0;
  const childCount = hasChildren ? comment.childs!.length : 0;

  const formattedDate = new Date(comment.createDate);
  const likesCount = comment.liked?.length || 0;
  const dislikesCount = comment.dislikes?.length || 0;

  return (
    <div className="relative">
      <div
        className="flex w-full max-w-2xl gap-3"
        style={{ marginLeft: level > 0 ? `${level * INDENT_SIZE}px` : 0 }}
      >
        <div className="flex flex-col gap-1 items-center">
          <Avatar className="size-10 flex-shrink-0">
            <AvatarImage src={authorAvatar} alt={authorName} />
            <AvatarFallback>
              {authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{authorName}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formattedDate.toLocaleDateString()}
            </span>
          </div>

          <p className="text-sm leading-relaxed">
            {comment.isDeleted ? (
              <span className="italic text-muted-foreground">
                [Комментарий удален]
              </span>
            ) : (
              comment.text
            )}
          </p>

          <div className="flex justify-between pt-2">
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={() => onLike?.(comment.id)}
              >
                <ThumbsUp className="size-3.5" />
                {likesCount > 0 && <span>{likesCount}</span>}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs"
                onClick={() => onDislike?.(comment.id)}
              >
                <ThumbsDown className="size-3.5" />
                {dislikesCount > 0 && <span>{dislikesCount}</span>}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => onReply?.(comment.id)}
              >
                Ответить
              </Button>

              {hasChildren && level < MAX_VISIBLE_LEVEL && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs text-muted-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                  <span>
                    {isExpanded ? "Спрятать" : "Показать"} ({childCount})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && level < MAX_VISIBLE_LEVEL && (
        <div className="pt-3 space-y-3">
          {comment.childs!.map((child) => (
            <Comment
              key={child.id}
              comment={child}
              authorName={child.userId}
              authorAvatar={undefined}
              onLike={onLike}
              onDislike={onDislike}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
