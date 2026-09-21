import React, { type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export const CommonWrapper: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "max-w-[95%] mt-3 mb-20 mx-auto flex flex-col gap-5",
        className,
      )}
    >
      {children}
    </div>
  );
};
