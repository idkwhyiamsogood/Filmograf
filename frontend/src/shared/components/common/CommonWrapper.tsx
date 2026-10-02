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
        "mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-safe mt-4 animate-fade-up",
        className,
      )}
    >
      {children}
    </div>
  );
};
