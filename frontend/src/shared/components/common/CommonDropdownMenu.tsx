"use client";

import React, { type ReactNode, useRef, useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface Props {
  trigger: ReactNode;
  content: ReactNode;
  align?: "start" | "center" | "end" | undefined;
}

export const CommonDropdownMenu: React.FC<Props> = ({
  trigger,
  content,
  align = "start",
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [contentWidth, setContentWidth] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (triggerRef.current) {
      const width = triggerRef.current.offsetWidth;
      setContentWidth(width);
    }
  }, [isOpen]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild={true} ref={triggerRef}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[300px] overflow-auto"
        style={contentWidth ? { width: `${contentWidth}px` } : {}}
        align={align}
      >
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
