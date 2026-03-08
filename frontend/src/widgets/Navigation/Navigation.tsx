"use client";

import type { INavigationItem } from "@/shared/types";
import type { FC } from "react";

import { NavigationItem } from "./ui/NavigationItem";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { navigationMenu } from "@/shared/constants";
import { useModals } from "@/shared/hooks";

export const Navigation: FC = () => {
  const [current, setCurrent] = useState<number | undefined>(undefined);

  const router = useRouter();
  const pathname = usePathname();
  const { openModal } = useModals();

  useEffect(() => {
    const current = navigationMenu.items.find((item) => item.url === pathname);
    setCurrent(current ? current.id : 2);
  }, [pathname]);

  const handleClick = (index: number, url: string) => {
    if (index === 4) {
      openModal("right-menu");
      return;
    }
    
    router.push(url);
  };

  return (
    <div className="px-4 py-2 flex justify-around items-center bg-accent">
      {navigationMenu.items.map((item: INavigationItem) => (
        <NavigationItem
          item={item}
          key={item.label}
          isActive={current === item.id}
          onClick={() => handleClick(item.id, item.url)}
        />
      ))}
    </div>
  );
};
