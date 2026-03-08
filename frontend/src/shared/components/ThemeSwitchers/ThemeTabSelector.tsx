"use client";

import type { FC } from "react";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { TabsTrigger, Tabs, TabsList } from "@/shared/ui/tabs";

export const ThemeTabSelector: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Tabs
        value={theme || "system"}
        onValueChange={(value) => setTheme(value)}
        className="w-auto"
        suppressHydrationWarning
      >
        <TabsList
          className="bg-background/90 border-none gap-1"
          suppressHydrationWarning
        >
          <TabsTrigger
            value="light"
            className={`px-1.5 hover:bg-primary/10 transition-colors duration-100 ${theme === "light" ? "bg-primary/10" : ""}`}
            suppressHydrationWarning
          >
            <Sun
              className={`h-4 w-4 ${theme === "light" ? "dark:text-primary" : ""}`}
              suppressHydrationWarning
            />
          </TabsTrigger>
          <TabsTrigger
            value="dark"
            className={`px-1.5 hover:bg-primary/10 transition-colors duration-100 ${theme === "dark" ? "bg-primary/10" : ""}`}
            suppressHydrationWarning
          >
            <Moon
              className={`h-4 w-4 ${theme === "dark" ? "text-primary" : ""}`}
              suppressHydrationWarning
            />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
