// types
import type { FC } from "react";

// fn
import { cn } from "@/shared/lib/utils";
import type { INavigationItem } from "@/shared/types";

interface Props {
  item: INavigationItem;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavigationItem: FC<Props> = ({
  item,
  isActive = false,
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(
        className,
        "p-3 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-transparent text-muted-foreground hover:bg-muted",
        item.isMain && "p-5! rounded-full!",
      )}
      onClick={onClick}
    >
      <item.icon size={24} />
    </div>
  );
};
