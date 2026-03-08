"use client";

import React from "react";

import { navigationMenu } from "@/shared/constants";
import { useModals } from "@/shared/hooks";
import { useRouter } from "next/navigation";

import { NavigationItem } from "./NavigationItem";

export const NavigationMenu: React.FC = () => {
  const { closeModal } = useModals();
  const router = useRouter();

  const handleClick = (itemId: number) => {
    const navItem = navigationMenu.items.find((item) => item.id === itemId);

    try {
      closeModal();
    } finally {
      router.push(navItem!.url);
    }
  };

  return (
    <div>
      {navigationMenu.items.map((item) => (
        <NavigationItem item={item} onClick={handleClick} key={"RM-navItem" + item.id}/>
      ))}
    </div>
  );
};
