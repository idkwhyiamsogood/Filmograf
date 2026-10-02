import { useCallback, useMemo, useState, type FC } from "react";
import { MessageCircle } from "lucide-react";

import {
  CommentList,
  CommentSkeleton,
  CommentThreadContext,
  useChildsComment,
  useParentComment,
  type CommentThreadValue,
} from "@/entities/comment";
import { UserLogo, useRequireMember, useUser } from "@/entities/user";
import { useCommentReaction } from "@/features/comment/common";
import { CommentComposer, useCreateComment } from "@/features/comment/create-comment";
import { useDeleteComment } from "@/features/comment/delete-comment";
import { useEditComment } from "@/features/comment/update-comment";
import { EmptyState, QueryErrorState } from "@/shared/components";
import { useModals } from "@/shared/contexts/modal-context";
import { pluralize } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

import { useSearchEntity } from "../model/hooks/useSearchEntity";

export const CommentWrapper: FC = () => {
  const entity = useSearchEntity();
  const { user, isGuest } = useUser();
  const requireMember = useRequireMember();
  const { openModal } = useModals();

  const { data: comments, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useParentComment(entity);

  const { mutateAsync: createComment } = useCreateComment();
  const { mutate: react } = useCommentReaction(entity);
  const { mutate: removeComment } = useDeleteComment(entity);
  const { mutateAsync: editComment } = useEditComment(entity);
  const { mutate: loadReplies, isPending: isLoadingReplies, variables: loadingId } = useChildsComment(entity);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const uid = user?.id ?? "";
  const member = useCallback(
    (fn: () => void) => requireMember("участвовать в обсуждении", fn),
    [requireMember],
  );

  const thread = useMemo<CommentThreadValue>(
    () => ({
      currentUserId: isGuest ? undefined : uid,
      replyingTo,
      editingId,
      loadingRepliesId: isLoadingReplies ? (loadingId ?? null) : null,
      react: (comment, reaction) =>
        member(() => react({ commentId: comment.id, reaction, userId: uid })),
      startReply: (id) =>
        member(() => {
          setEditingId(null);
          setReplyingTo((cur) => (cur === id ? null : id));
        }),
      startEdit: (id) => {
        setReplyingTo(null);
        setEditingId(id);
      },
      remove: (id) =>
        openModal("confirmation-menu", {
          title: "Удалить комментарий?",
          description: "Ответы останутся, а вместо текста будет пометка «удалён».",
          confirmText: "Удалить",
          onConfirm: () => removeComment(id),
        }),
      loadReplies: (id) => loadReplies(id),
      renderReplyComposer: (parent) => (
        <CommentComposer
          compact
          autoFocus
          placeholder="Ваш ответ…"
          submitLabel="Ответить"
          onCancel={() => setReplyingTo(null)}
          onSubmit={(text) => {
            setReplyingTo(null);
            return createComment({ entity, text, parentId: parent.id, userId: uid });
          }}
        />
      ),
      renderEditComposer: (comment) => (
        <CommentComposer
          compact
          autoFocus
          initialText={comment.text}
          submitLabel="Сохранить"
          onCancel={() => setEditingId(null)}
          onSubmit={(text) => {
            setEditingId(null);
            return editComment({ commentId: comment.id, text });
          }}
        />
      ),
    }),
    [uid, isGuest, replyingTo, editingId, isLoadingReplies, loadingId, entity, member, react, removeComment, loadReplies, createComment, editComment, openModal],
  );

  return (
    <CommentThreadContext.Provider value={thread}>
      <div className="flex w-full flex-col gap-5">
        {isGuest ? (
          <button
            type="button"
            onClick={() => requireMember("участвовать в обсуждении")}
            className="press flex items-center gap-3 rounded-2xl bg-muted px-4 py-3.5 text-left text-sm text-muted-foreground"
          >
            <MessageCircle className="size-5 text-primary" />
            Войдите, чтобы написать комментарий
          </button>
        ) : (
          <div className="flex gap-3">
            <UserLogo logo={user?.avatarUrl} name={user?.name} className="mt-1 size-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <CommentComposer onSubmit={(text) => createComment({ entity, text, userId: uid })} />
            </div>
          </div>
        )}

        {isLoading ? (
          <CommentSkeleton count={3} />
        ) : isError ? (
          <QueryErrorState compact onRetry={() => refetch()} serverErrorMessage="Не удалось загрузить комментарии" />
        ) : comments.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Пока никто не обсуждал"
            description="Станьте первым — поделитесь впечатлениями."
            className="py-8"
          />
        ) : (
          <>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              {pluralize(comments.length, ["комментарий", "комментария", "комментариев"])}
              {hasNextPage && "+"}
            </p>
            <CommentList comments={comments} />
            {hasNextPage && (
              <Button
                variant="secondary"
                className="h-11 rounded-xl font-bold"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Загружаем…" : "Показать ещё"}
              </Button>
            )}
          </>
        )}
      </div>
    </CommentThreadContext.Provider>
  );
};
