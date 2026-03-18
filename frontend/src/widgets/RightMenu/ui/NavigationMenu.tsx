"use client";

import React, { useMemo } from "react";

import { fullNavigation } from "@/shared/configs";
import { useModals } from "@/shared/hooks";
import { useRouter } from "next/navigation";

import { NavigationItem } from "./NavigationItem";
import { INavigationItem } from "@/shared/types";

export const NavigationMenu: React.FC = () => {
  const { closeModal } = useModals();
  const router = useRouter();

  const filteredMenu = useMemo(() => {
    return fullNavigation.items.filter((item) => item.id !== 4);
  }, []);

  const handleClick = (itemId: number) => {
    const findItemById = (
      items: typeof filteredMenu,
      id: number,
    ): INavigationItem | null => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }

        if (item.childs && item.childs.length > 0) {
          const foundInChildren = findItemById(item.childs, id);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }
      return null;
    };

    const navItem = findItemById(filteredMenu, itemId);

    if (navItem?.childs && navItem.childs.length > 0) {
      return;
    }

    closeModal();
    router.push(navItem!.url);
  };

  return (
    <div>
      {filteredMenu.map((item) => (
        <NavigationItem
          item={item}
          onClick={handleClick}
          key={`nav-item-${item.id}`}
        />
      ))}
    </div>
  );
};
