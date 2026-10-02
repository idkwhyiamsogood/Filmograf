import React, { type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface Props {
  children: ReactNode;
  /** Ширина элемента, например "w-[30%]" или "w-[72%]" */
  itemClassName?: string;
  className?: string;
}

/**
 * Горизонтальная лента с нативным scroll-snap: на телефоне листается
 * пальцем с инерцией, края уходят за экран (подсказка, что лента скроллится).
 */
export const Rail: React.FC<Props> = ({ children, itemClassName = "w-[30%] sm:w-[22%]", className }) => (
  <div
    className={cn(
      "no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1",
      className,
    )}
  >
    {React.Children.map(children, (child) =>
      child ? (
        <div className={cn("shrink-0 snap-start", itemClassName)}>{child}</div>
      ) : null,
    )}
  </div>
);
