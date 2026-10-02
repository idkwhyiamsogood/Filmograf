import React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const OPTIONS = [
  { value: "system", label: "Авто", icon: Monitor },
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
] as const;

export const ThemeSegmented: React.FC<{ className?: string }> = ({ className }) => {
  const { theme = "system", setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Тема оформления"
      className={cn("grid grid-cols-3 gap-1 rounded-xl bg-muted p-1", className)}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
};
