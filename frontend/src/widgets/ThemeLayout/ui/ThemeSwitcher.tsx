"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { TabsTrigger, Tabs, TabsList } from "@/shared/ui/tabs";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  if (!theme) return null;

  return (
    <Tabs
      value={theme || "system"}
      onValueChange={(value) => setTheme(value)}
      className="w-auto"
    >
      <TabsList className="bg-background/90 border-none gap-1">
        <TabsTrigger
          value="light"
          className={`px-1.5 hover:bg-primary/10 transition-colors duration-100 ${theme === "light" ? "bg-primary/10" : ""}`}
        >
          <Sun
            className={`h-4 w-4 ${theme === "light" ? "dark:text-primary" : ""}`}
          />
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          className={`px-1.5 hover:bg-primary/10 transition-colors duration-100 ${theme === "dark" ? "bg-primary/10" : ""}`}
        >
          <Moon
            className={`h-4 w-4 ${theme === "dark" ? "text-primary" : ""}`}
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
