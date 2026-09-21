import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

import { ContentEditable } from "@/shared/components/lexical/editor/editor-ui/content-editable";
import { cn } from "@/shared/lib/utils";
import type { Toolbar } from "./editor";

interface Props<TProps = Record<string, never>> {
  handleClick: () => void;
  toolbar: Toolbar<TProps>;
  toolbarProps?: TProps;
}

export const Plugins = <
  TProps extends Record<string, unknown> = Record<string, never>,
>({
  handleClick,
  toolbar,
  toolbarProps,
}: Props<TProps>) => {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const ToolbarComponent = toolbar.ToolbarComp;

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute left-0 z-20 w-full pointer-events-auto",
          toolbar.align === "top" ? "top-0" : "bottom-0",
        )}
      >
        <ToolbarComponent {...((toolbarProps ?? toolbar.props) as TProps)} />
      </div>

      <div
        className={cn(
          "relative z-0 min-h-20",
          toolbar.align === "top" ? "pt-12" : "pb-12",
        )}
      >
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef} onClick={handleClick}>
                <ContentEditable placeholder={"Введите комментарий..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </div>
  );
};