import React from "react";

import { Switch } from "@/shared/ui/switch";
import { useToggleTheme } from "../model/useToggleTheme";

interface Props {
  className?: string;
}

export const ThemeToggleFull: React.FC<Props> = ({ className }) => {
  const { toggleTheme, currentTheme } = useToggleTheme();

  const isDark = currentTheme === "dark";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-primary"
      />
      <span className="text-sm font-medium">
        {isDark ? "Тёмная" : "Светлая"} тема
      </span>
    </div>
  );
};
