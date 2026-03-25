import React, { useMemo } from "react";
import { type SerializedEditorState } from "lexical";
import { EditorState } from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@/shared/components/lexical/editor/editor-ui/content-editable";
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

  return (
    <LexicalComposer key={commentId} initialConfig={commentConfig}>
      <RichTextPlugin
        contentEditable={
          <div className="lexical-render-wrapper">
            <ContentEditable
              placeholder={""}
              className="text-sm leading-relaxed"
            />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};
