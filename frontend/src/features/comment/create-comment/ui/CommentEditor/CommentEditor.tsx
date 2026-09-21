import React, { useState } from "react";

import { Editor } from "@/shared/components";
import { CommentToolbar, type CommentProps } from "./CommentToolbar";

import { SerializedEditorState } from "lexical";

import { initialValue } from "@/shared/configs";
import type { Entity } from "@/shared/types";

import { useCreateChildComment } from "../../model/hooks/useCreateChildComment";
import { useCreateParentComment } from "../../model/hooks/useCreateParentComment";

interface Props {
  entity: Entity;
  parentCommentId?: string;
  onClose?: () => void;
}

export const CommentEditor: React.FC<Props> = ({
  onClose,
  entity,
  parentCommentId,
}) => {
  const [isActive, setIsActive] = useState<boolean>(() =>
    Boolean(parentCommentId),
  );
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const createParentMutation = useCreateParentComment();
  const createChildMutation = useCreateChildComment();

  const closeAndDeactivate = () => {
    onClose?.();
    setIsActive(false);
  };

  const handleClick = () => {
    setEditorState({} as SerializedEditorState);
    if (!isActive) setIsActive(true);
  };

  const handleSend = () => {
    console.log(editorState);
    const text = JSON.stringify(editorState);
    if (!text) return;

    console.log(text);

    const onSuccess = () => {
      closeAndDeactivate();
    };

    if (!parentCommentId) {
      createParentMutation.mutate(
        { entity, data: { text: text } },
        { onSuccess },
      );
    } else {
      createChildMutation.mutate(
        {
          parentCommentId: parentCommentId,
          entity,
          data: { text },
        },
        { onSuccess },
      );
    }
  };

  return (
    <Editor<CommentProps>
      editorSerializedState={editorState}
      onSerializedChange={(value) => setEditorState(value)}
      handleClick={handleClick}
      toolbar={{
        ToolbarComp: CommentToolbar,
        align: "bottom",
        props: {
          isActive,
          setInactive: () => {
            closeAndDeactivate();
          },
          handleSend,
        },
      }}
    />
  );
};
