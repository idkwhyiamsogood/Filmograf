"use client";


import type { FC } from "react";
import type { INavigationItem } from "@/shared/types";

import { FooterItem } from "./FooterItem";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { navigationMenu } from "@/shared/constants";

export const Footer: FC = () => {
  const [current, setCurrent] = useState<number | undefined>(undefined);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const current = navigationMenu.items.find((item) => item.url === pathname);
    setCurrent(current ? current.id : 2);
  }, []);

  const handleClick = (index: number, url: string) => {
    router.push(url);
    setCurrent(index);
  };

  return (
    <div className="px-4 py-2 flex justify-around items-center bg-accent">
      {navigationMenu.items.map((item: INavigationItem) => (
        <FooterItem
          item={item}
          key={item.label}
          isActive={current === item.id}
          onClick={() => handleClick(item.id, item.url)}
        />
      ))}
    </div>
  );
};
