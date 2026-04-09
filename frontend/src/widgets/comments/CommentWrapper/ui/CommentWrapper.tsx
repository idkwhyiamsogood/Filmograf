"use client";

import React, { useState } from "react";

import { CommentList, useParentComment } from "@/entities/comment";
import { CommentSkeleton } from "@/entities/comment/";
import { CommentEditor } from "@/features/comment/create-comment";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { useSearchEntity } from "../model/hooks/useSearchEntity";

import { useUser } from "@/entities/user";
import { useDislikeComment } from "@/features/comment/dislike-comment";
import { useLikeComment } from "@/features/comment/like-comment";
import { useChildsComment } from "@/entities/comment";
import { useResetReaction } from "@/features/comment/common";

export const CommentWrapper: React.FC = () => {
  const entity = useSearchEntity();

  const { user } = useUser();

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

  return (
    <div className="w-full">
      <ScrollArea className="max-w-full w-full px-2.5 h-screen">
        <div className="pb-5">
          <CommentEditor entity={entity} />
        </div>

        <CommentList
          comments={parentComments}
          getUser={(userId: string) => {
            return {
              avatarUrl: "",
              name: "",
              userType: "Member",
              email: "",
              googleId: "",
              createDate: new Date(),
              updateDate: new Date(),
              id: "",
            };
          }}
          onDislike={dislikeComment}
          onLike={likeComment}
          resetReaction={resetReaction}
          onReply={(commentId) =>
            setActiveReplyId((prev) => (prev === commentId ? null : commentId))
          }
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

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
