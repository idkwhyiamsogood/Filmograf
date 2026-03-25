"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { editorTheme } from "@/shared/components/lexical/editor/themes/editor-theme";
import { TooltipProvider } from "@/shared/ui/tooltip";

import { ComponentType, useState } from "react";
import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export type Toolbar<TProps = Record<string, never>> = {
  ToolbarComp: ComponentType<TProps>;
  align: "top" | "bottom";
  props?: TProps;
};

interface Props<TProps = Record<string, never>> {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;

  handleClick: () => void;
  toolbar: Toolbar<TProps>;
  toolbarProps?: TProps;
}

export const Editor = <
  TProps extends Record<string, unknown> = Record<string, never>,
>({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,

  handleClick,
  toolbar,
  toolbarProps,
}: Props<TProps>) => {
  const [currentEditorState, setCurrentEditorState] = useState<
    EditorState | undefined
  >(editorState);

  const resolvedToolbarProps = (toolbar.props ?? toolbarProps) as TProps;

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...currentEditorState,
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins
            handleClick={handleClick}
            toolbar={toolbar}
            toolbarProps={resolvedToolbarProps}
          />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
};
