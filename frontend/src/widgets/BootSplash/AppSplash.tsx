import { useEffect, useState, type FC } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

import { BootSplash } from "./BootSplash";

const FADE_MS = 300;
/** Страховка: если что-то пошло не так, нативный сплэш не должен висеть вечно. */
const MAX_NATIVE_MS = 8000;
const SESSION_KEY = "boot-splash-shown";

const hideNative = () => SplashScreen.hide({ fadeOutDuration: FADE_MS }).catch(() => undefined);

/** Постер показываем один раз за сессию вкладки — F5 его не вызывает. */
const wasPosterShown = () => {
  try {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return true;
  }
};

const markPosterShown = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore
  }
};

/**
 * Экран загрузки приложения.
 *
 * Нативно — @capacitor/splash-screen: его показывает сама ОС при холодном
 * старте процесса (launchAutoHide: false в capacitor.config.ts), а мы прячем,
 * когда готова сессия. Перезагрузка WebView (F5, live reload) нативный сплэш
 * не показывает — hide() в этом случае ничего не делает.
 *
 * В браузере нативного сплэша нет — там один раз за сессию вкладки
 * показываем анимированный постер BootSplash.
 */
export const AppSplash: FC<{ ready: boolean }> = ({ ready }) => {
  const isNative = Capacitor.isNativePlatform();
  // Чистый инициализатор (StrictMode вызывает его дважды), флаг — в эффекте.
  const [showPoster] = useState(() => !isNative && !wasPosterShown());

  useEffect(() => {
    if (showPoster) markPosterShown();
  }, [showPoster]);

  useEffect(() => {
    if (!isNative) return;
    const t = window.setTimeout(hideNative, MAX_NATIVE_MS);
    return () => window.clearTimeout(t);
  }, [isNative]);

  useEffect(() => {
    if (isNative && ready) hideNative();
  }, [isNative, ready]);

  return showPoster ? <BootSplash ready={ready} /> : null;
};
