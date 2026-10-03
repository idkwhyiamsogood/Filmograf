import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";

import {
  applyAccent,
  DEFAULT_APPEARANCE,
  loadAppearance,
  resolvePalette,
  saveAppearance,
  type AppearanceSettings,
  type Palette,
  type ThemeMode,
} from "@/shared/lib/appearance";

interface AppearanceContextValue {
  settings: AppearanceSettings;
  palette: Palette;
  setAccent: (accent: string) => void;
  setMode: (mode: ThemeMode) => void;
  /** Применить и сохранить несколько настроек разом (шторка «Оформление»). */
  setAppearance: (next: AppearanceSettings) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);
  const [palette, setPalette] = useState<Palette>(resolvePalette(DEFAULT_APPEARANCE));
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Настройки уже применены в main.tsx — тут только синхронизируем состояние.
  useEffect(() => {
    loadAppearance().then((s) => {
      setSettings(s);
      setPalette(resolvePalette(s));
    });
  }, []);

  // «Цвет дня»: при возвращении в приложение проверяем, не наступил ли новый день.
  useEffect(() => {
    if (settings.accent !== "daily") return;
    const check = () => {
      const next = resolvePalette(settings);
      if (next.id !== palette.id) {
        applyAccent(next);
        setPalette(next);
      }
    };
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, [settings, palette.id]);

  const update = useCallback((patch: Partial<AppearanceSettings>) => {
    const next = { ...settingsRef.current, ...patch };
    settingsRef.current = next;
    const p = resolvePalette(next);
    applyAccent(p);
    saveAppearance(next);
    setSettings(next);
    setPalette(p);
  }, []);

  const setAccent = useCallback((accent: string) => update({ accent }), [update]);
  const setMode = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode);
      update({ mode });
    },
    [setTheme, update],
  );
  const setAppearance = useCallback(
    (next: AppearanceSettings) => {
      if (next.mode !== settingsRef.current.mode) setTheme(next.mode);
      update(next);
    },
    [setTheme, update],
  );

  return (
    <AppearanceContext.Provider value={{ settings, palette, setAccent, setMode, setAppearance }}>
      {children}
    </AppearanceContext.Provider>
  );
};

export const useAppearance = () => {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance вне AppearanceProvider");
  return ctx;
};
