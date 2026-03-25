"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useState, useRef, type FC } from "react";

import { CommentEditorActions } from "./CommentEditorActions";

import type { TextFormatState } from "../../model/types/text-format";

export interface CommentProps {
  isActive?: boolean;
  setInactive: () => void;
  handleSend: () => void;
  [key: string]: unknown;
}

export const CommentToolbar: FC<CommentProps> = ({
  isActive = true,
  setInactive,
  handleSend,
}) => {
  const [activeState, setActiveState] = useState<TextFormatState>({
    isBold: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
  });

  const [editor] = useLexicalComposerContext();

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }

    const nextState: TextFormatState = {
      isBold: selection.hasFormat("bold"),
      isItalic: selection.hasFormat("italic"),
      isUnderline: selection.hasFormat("underline"),
      isStrikethrough: selection.hasFormat("strikethrough"),
    };

    setActiveState((prev) => {
      if (
        prev.isBold === nextState.isBold &&
        prev.isItalic === nextState.isItalic &&
        prev.isUnderline === nextState.isUnderline &&
        prev.isStrikethrough === nextState.isStrikethrough
      ) {
        return prev;
      }

      return nextState;
    });
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  if (!isActive) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1 border-b bg-muted/25 px-2 py-1"
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", activeState.isBold && "bg-muted")}
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", activeState.isItalic && "bg-muted")}
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", activeState.isUnderline && "bg-muted")}
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", activeState.isStrikethrough && "bg-muted")}
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <CommentEditorActions
        setInactive={setInactive}
        handleSend={handleSend}
        isSmall={window.innerWidth < 380}
      />
    </div>
  );
};
