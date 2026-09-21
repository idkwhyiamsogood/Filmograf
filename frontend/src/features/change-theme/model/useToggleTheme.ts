import { useTheme } from "next-themes";

import { useCallback } from "react";
import type { ThemeMode } from "./types";

export const useToggleTheme = () => {
  const { theme, setTheme } = useTheme();

  const currentTheme = (theme as ThemeMode) || "light";

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, [currentTheme]);

  return { theme, currentTheme, toggleTheme };
};
