"use client";

import React from "react";

// types
import type { FC } from "react";
import type { LucideProps } from "lucide-react";

// fn
import { cn } from "@/shared/lib/utils";

// components
import { NotepadText, Settings, Home, User } from "lucide-react";

// hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FooterItemProps {
  icon: React.ComponentType<LucideProps>;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FooterItem: FC<FooterItemProps> = ({
  icon: Icon,
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
          : "bg-transparent text-muted-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <Icon size={24} />
    </div>
  );
};

export const Footer: FC = () => {
  const [current, setCurrent] = useState<number>(0);

  const router = useRouter();

  const menu = [
    { icon: Home, label: "Главная", url: "/" },
    { icon: NotepadText, label: "Заметки", url: "/films" },
    { icon: User, label: "Профиль", url: "/profile" },
    { icon: Settings, label: "Настройки", url: "/settings" },
  ];

  const handleClick = (index: number, url: string) => {
    router.push(url);
    setCurrent(index);
  };

  return (
    <div className="px-4 py-2 flex justify-around items-center">
      {menu.map((item, index) => (
        <FooterItem
          key={item.label}
          icon={item.icon}
          isActive={current === index}
          onClick={() => handleClick(index, item.url)}
        />
      ))}
    </div>
  );
};
