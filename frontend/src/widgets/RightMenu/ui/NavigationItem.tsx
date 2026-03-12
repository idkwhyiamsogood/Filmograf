"use client";

import React, { useState } from "react";
import type { INavigationItem } from "@/shared/types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  item: INavigationItem;
  onClick: (id: number) => void;
}

export const NavigationItem: React.FC<Props> = ({ item, onClick }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    
    if (item.childs) {
      setIsExpanded((prev) => !prev);
    }
    
    onClick(id);
  };

  return (
    <div className="w-full">
      <div
        className="group relative flex items-center py-2.5 cursor-pointer justify-between w-full hover:bg-muted transition-colors"
        onClick={(e) => handleClick(e, item.id)}
      >
        <div className="flex gap-3 items-center">
          {item.icon && <item.icon size={16} />}
          <p className="text-sm font-medium">{item.label}</p>
        </div>

        {item.childs && (
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
        )}
      </div>

      {item.childs && isExpanded && (
        <div className="flex flex-col pl-5">
          {item.childs.map((childItem) => (
            <NavigationItem
              key={childItem.id}
              item={childItem}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};