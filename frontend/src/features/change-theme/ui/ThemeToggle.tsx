"use client";

import React from "react";

import { Switch } from "@/shared/ui/switch";
import { useToggleTheme } from "../model/useToggleTheme";

interface Props {
  className?: string;
}

export const ThemeToggle: React.FC<Props> = ({ className }) => {
  const { toggleTheme, currentTheme } = useToggleTheme();

  return (
    <div className={className}>
      <Switch
        checked={currentTheme === "dark"}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};
