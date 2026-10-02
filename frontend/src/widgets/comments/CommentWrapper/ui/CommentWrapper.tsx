import React, { useState } from "react";

import { CommentList, useParentComment } from "@/entities/comment";
import { CommentSkeleton } from "@/entities/comment/";
import { CommentEditor } from "@/features/comment/create-comment";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/shared/components";
import { useSearchEntity } from "../model/hooks/useSearchEntity";

import { useRequireMember, useUser } from "@/entities/user";
import { useDislikeComment } from "@/features/comment/dislike-comment";
import { useLikeComment } from "@/features/comment/like-comment";
import { useChildsComment } from "@/entities/comment";
import { useResetReaction } from "@/features/comment/common";
import { userApi } from "@/entities/user";

export const CommentWrapper: React.FC = () => {
  const entity = useSearchEntity();

  const { user, isGuest } = useUser();
  const requireMember = useRequireMember();

  const commentProps = {
    userId: user?.id,
    entityId: entity.entityId,
    entityType: entity.type,
  };

  const { mutate: dislikeComment } = useDislikeComment(commentProps);
  const { mutate: likeComment } = useLikeComment(commentProps);
  const { mutate: resetReaction } = useResetReaction(commentProps);
  const { mutate: updateWithChilds } = useChildsComment({
    type: commentProps.entityType,
    entityId: commentProps.entityId,
  });

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const { data: parentComments, isLoading } = useParentComment(entity);

  if (isLoading) return <CommentSkeleton count={5} />;

  if (!parentComments) return null;

  const guard =
    (fn: (id: string) => void) =>
    (id: string) =>
      requireMember("участвовать в обсуждении", () => fn(id));

  return (
    <div className="flex w-full flex-col gap-4">
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
        <CommentEditor entity={entity} />
      )}

      {parentComments.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Пока никто не обсуждал"
          description="Станьте первым — поделитесь впечатлениями."
          className="py-8"
        />
      ) : (
        <CommentList
          comments={parentComments}
          getUser={async (userId: string) => (await userApi.getUser(userId)).data}
          onDislike={guard(dislikeComment)}
          onLike={guard(likeComment)}
          resetReaction={guard(resetReaction)}
          onReply={guard((commentId) =>
            setActiveReplyId((prev) => (prev === commentId ? null : commentId)),
          )}
          renderReplyEditor={(commentId) => {
            return activeReplyId === commentId ? (
              <div className="mt-2">
                <CommentEditor
                  entity={entity}
                  parentCommentId={commentId}
                  onClose={() => setActiveReplyId(null)}
                />
              </div>
            ) : null;
          }}
          updateWithChilds={updateWithChilds}
        />
      )}
    </div>
  );
};
