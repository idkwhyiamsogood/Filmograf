import React, { type ReactNode, useEffect, useRef, useState } from "react";

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild={true} >
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[300px] overflow-auto"
        align={align}
      >
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
