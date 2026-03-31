"use client";

import type { FC } from "react";

import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";

import { useModals } from "@/shared/hooks";

import { commentApi } from "@/entities/comment/model/api/comment.api";
import { Comment } from "@/entities/comment";
import { useUser } from "@/entities/user";

interface Props {
  comment: Comment;
}

export const DeleteComment: FC<Props> = ({ comment }) => {
  const { openModal } = useModals();
  const { user } = useUser();

  const onDelete = async (id: string) => {
    try {
      await commentApi.deleteComment(id);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = () => {
    openModal("confirmation-menu", { onConfirm: () => onDelete(comment.id) });
  };

  if (comment.userId !== user!.id) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 gap-1 text-xs"
      onClick={handleDelete}
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
};
