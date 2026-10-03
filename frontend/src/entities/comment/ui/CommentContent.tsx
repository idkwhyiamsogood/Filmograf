import React, { useMemo } from "react";
import { type SerializedEditorState } from "lexical";
import { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { editorTheme, nodes } from "@/shared/components/";

interface Props {
  commentId: string;
  content: string;
}

export const CommentContent: React.FC<Props> = ({ commentId, content }) => {
  const commentConfig = useMemo<InitialConfigType>(() => {
    let editorState = content;

    const isLexicalJson = content.startsWith('{"root":');

    if (!isLexicalJson) {
      editorState = JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: content,
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      });
    }

    return {
      namespace: `Comment-${commentId}`,
      theme: editorTheme,
      nodes,
      editorState: editorState,
      onError: (error: Error) => console.error(error),
      editable: false,
    };
  }, [commentId, content]);

  // Спойлер раскрывается по нажатию. Редактор только для чтения — Lexical
  // DOM не перерисует, так что класс можно повесить напрямую.
  const revealSpoiler = (e: React.MouseEvent) => {
    const spoiler = (e.target as HTMLElement).closest<HTMLElement>("[data-spoiler]");
    if (!spoiler || spoiler.classList.contains("is-revealed")) return;
    e.stopPropagation();
    spoiler.classList.add("is-revealed");
  };

  return (
    <LexicalComposer key={commentId} initialConfig={commentConfig}>
      <RichTextPlugin
        contentEditable={
          <div className="lexical-render-wrapper" onClick={revealSpoiler}>
            <ContentEditable className="text-[15px] leading-relaxed outline-none" />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};
