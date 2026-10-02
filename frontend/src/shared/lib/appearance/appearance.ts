import { Preferences } from "@capacitor/preferences";
import { dailyPalette, paletteById, paletteVars, type Palette } from "./palettes";

export type ThemeMode = "system" | "light" | "dark";

export interface AppearanceSettings {
  /** id палитры или "daily" — каждый день новый цвет */
  accent: string;
  mode: ThemeMode;
}

const KEY = "appearance";
export const DEFAULT_APPEARANCE: AppearanceSettings = { accent: "amber", mode: "system" };

export const resolvePalette = (s: AppearanceSettings): Palette =>
  s.accent === "daily" ? dailyPalette() : paletteById(s.accent);

/** Вписать переменные акцента в <style id="accent-vars"> — тема пересчитается целиком. */
export const applyAccent = (palette: Palette) => {
  let el = document.getElementById("accent-vars") as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = "accent-vars";
    document.head.appendChild(el);
  }
  el.textContent = paletteVars(palette);
};

export const loadAppearance = async (): Promise<AppearanceSettings> => {
  try {
    const { value } = await Preferences.get({ key: KEY });
    return value ? { ...DEFAULT_APPEARANCE, ...JSON.parse(value) } : DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
};

export const saveAppearance = (s: AppearanceSettings) =>
  Preferences.set({ key: KEY, value: JSON.stringify(s) }).catch(() => undefined);

/**
 * До первого рендера: читаем настройки из Preferences, применяем акцент и
 * режим темы (next-themes читает localStorage "theme"), чтобы не было вспышки
 * цвета по умолчанию при запуске.
 */
export const bootstrapAppearance = async () => {
  const settings = await loadAppearance();
  applyAccent(resolvePalette(settings));
  try {
    localStorage.setItem("theme", settings.mode);
  } catch {
    // ignore
  }
  return settings;
};
