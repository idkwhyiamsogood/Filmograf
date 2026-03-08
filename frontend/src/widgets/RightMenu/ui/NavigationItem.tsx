import React from "react";
import type { INavigationItem } from "@/shared/types";

interface Props {
  item: INavigationItem;
  onClick: (id: number) => void;
  isActive?: boolean;
}

export const NavigationItem: React.FC<Props> = ({
  item,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      className={`
        group relative flex items-center gap-3 py-2.5 cursor-pointer
      `}
      onClick={() => onClick(item.id)}
    >
      <item.icon size={16} />
      
      <p className="text-sm font-medium">{item.label}</p>
    </div>
  );
};
