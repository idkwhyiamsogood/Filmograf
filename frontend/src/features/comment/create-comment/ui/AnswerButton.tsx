"use client";

import type { FC } from "react";
import type { Comment } from "@/entities/comment";

import { Button } from "@/shared/ui/button";

import { useModals } from "@/shared/hooks";

interface Props {
  comment: Comment;
}

export const AnswerButton: FC<Props> = ({ comment }) => {
  const { openModal } = useModals();

  const handleAnswer = () => {
    
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 text-xs"
      onClick={handleAnswer}
    >
      Ответить
    </Button>
  );
};
