import { memo, useEffect, useState, type FC } from "react";
import { ChevronDown, MoreHorizontal, Pencil, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";

import { UserLogo, useUserLight } from "@/entities/user";
import { formatRelative, pluralize } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";

import { MAX_VISIBLE_LEVEL } from "../model/constants/comments";
import type { Comment as CommentType } from "../model/types";
import { CommentContent } from "./CommentContent";
import { useCommentThread } from "./thread.context";

interface Props {
  comment: CommentType;
  level?: number;
}

export const Comment: FC<Props> = memo(({ comment, level = 0 }) => {
  const thread = useCommentThread();
  const { data: author, isLoading: isAuthorLoading } = useUserLight(comment.userId);

  const uid = thread.currentUserId;
  const isPending = comment.id.startsWith("temp-");
  const isOwn = Boolean(uid && comment.userId === uid);
  const myReaction = uid
    ? comment.likes.includes(uid)
      ? "like"
      : comment.dislikes.includes(uid)
        ? "dislike"
        : null
    : null;

  const loadedChilds = comment.childs ?? [];
  const hiddenReplies = comment.childsCount - loadedChilds.length;
  const [expanded, setExpanded] = useState(false);

  // Свой ответ сразу раскрывает ветку.
  useEffect(() => {
    if (loadedChilds.some((c) => c.id.startsWith("temp-"))) setExpanded(true);
  }, [loadedChilds]);

  const toggleReplies = () => {
    if (!expanded && hiddenReplies > 0) thread.loadReplies(comment.id);
    setExpanded((v) => !v);
  };

  const isEditing = thread.editingId === comment.id;
  const edited = !isPending && comment.updateDate !== comment.createDate;
  const canNest = level < MAX_VISIBLE_LEVEL;

  return (
    <div className={cn("flex flex-col gap-3", isPending && "opacity-60")}>
      <div className="flex gap-3">
        {isAuthorLoading ? (
          <Skeleton className="size-9 shrink-0 rounded-full" />
        ) : (
          <UserLogo logo={author?.avatarUrl} name={author?.name} className="size-9 shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-bold">
              {author?.name ?? (isAuthorLoading ? " " : "Пользователь")}
            </span>
            {isOwn && (
              <span className="rounded-md bg-brand-soft px-1.5 py-px text-[10px] font-bold text-primary uppercase">
                вы
              </span>
            )}
            <span className="text-xs text-muted-foreground">·</span>
            <time
              dateTime={String(comment.createDate)}
              title={new Date(comment.createDate).toLocaleString("ru-RU")}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {isPending ? "отправляется…" : formatRelative(comment.createDate)}
              {edited && " · изм."}
            </time>

            {isOwn && !isPending && !comment.isDeleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Действия с комментарием"
                    className="-my-1 ml-auto flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => thread.startEdit(comment.id)}>
                    <Pencil /> Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => thread.remove(comment.id)}>
                    <Trash2 /> Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-1 text-[15px] leading-relaxed break-words">
            {comment.isDeleted ? (
              <span className="text-sm text-muted-foreground italic">Комментарий удалён</span>
            ) : isEditing ? (
              <div className="mt-1">{thread.renderEditComposer(comment)}</div>
            ) : (
              <CommentContent key={comment.text} commentId={comment.id} content={comment.text} />
            )}
          </div>

          {!comment.isDeleted && !isEditing && (
            <div className="mt-1.5 -ml-2 flex items-center gap-0.5">
              <button
                type="button"
                disabled={isPending}
                aria-pressed={myReaction === "like"}
                aria-label="Нравится"
                onClick={() => thread.react(comment, myReaction === "like" ? null : "like")}
                className={cn(
                  "press flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors",
                  myReaction === "like" ? "bg-rating-high/15 text-rating-high" : "text-muted-foreground hover:bg-accent",
                )}
              >
                <ThumbsUp className={cn("size-4", myReaction === "like" && "fill-current")} />
                {comment.likes.length > 0 && comment.likes.length}
              </button>
              <button
                type="button"
                disabled={isPending}
                aria-pressed={myReaction === "dislike"}
                aria-label="Не нравится"
                onClick={() => thread.react(comment, myReaction === "dislike" ? null : "dislike")}
                className={cn(
                  "press flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition-colors",
                  myReaction === "dislike" ? "bg-rating-low/15 text-rating-low" : "text-muted-foreground hover:bg-accent",
                )}
              >
                <ThumbsDown className={cn("size-4", myReaction === "dislike" && "fill-current")} />
                {comment.dislikes.length > 0 && comment.dislikes.length}
              </button>
              {canNest && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => thread.startReply(comment.id)}
                  className="press h-8 rounded-full px-2.5 text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Ответить
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {thread.replyingTo === comment.id && <div className="pl-12">{thread.renderReplyComposer(comment)}</div>}

      {comment.childsCount > 0 && canNest && (
        <div className="pl-12">
          <button
            type="button"
            onClick={toggleReplies}
            className="flex items-center gap-1.5 text-xs font-bold text-primary"
          >
            {thread.loadingRepliesId === comment.id ? (
              <Spinner className="size-3.5" />
            ) : (
              <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
            )}
            {expanded ? "Скрыть ответы" : `Показать ${pluralize(comment.childsCount, ["ответ", "ответа", "ответов"])}`}
          </button>
        </div>
      )}

      {expanded && loadedChilds.length > 0 && (
        <div className={cn("flex flex-col gap-4", level < 3 && "ml-4 border-l-2 border-border pl-3")}>
          {loadedChilds.map((child) => (
            <Comment key={child.id} comment={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

Comment.displayName = "Comment";
