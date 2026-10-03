import { useEffect, useState, type FC } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

import { BootSplash } from "./BootSplash";

const FADE_MS = 300;
/** Страховка: если что-то пошло не так, нативный сплэш не должен висеть вечно. */
const MAX_NATIVE_MS = 8000;
const SESSION_KEY = "boot-splash-shown";

const hideNative = () => SplashScreen.hide({ fadeOutDuration: FADE_MS }).catch(() => undefined);

/**
 * Постер показываем один раз за сессию: вкладки в браузере или процесса
 * приложения (sessionStorage WebView живёт, пока жив процесс). F5 и live
 * reload его не вызывают.
 */
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
 * Нативно при холодном старте ОС сразу показывает @capacitor/splash-screen
 * (фон в цвет приложения, launchAutoHide: false) — он закрывает белый WebView,
 * пока грузится JS. Как только постер BootSplash отрисован, нативный сплэш
 * плавно уходит и дальше до готовности сессии виден постер.
 *
 * При перезагрузке (F5, live reload) постер не показываем; нативный сплэш
 * в этом случае не появляется, hide() ничего не делает.
 */
export const AppSplash: FC<{ ready: boolean }> = ({ ready }) => {
  const isNative = Capacitor.isNativePlatform();
  // Чистый инициализатор (StrictMode вызывает его дважды), флаг — в эффекте.
  const [showPoster] = useState(() => !wasPosterShown());
  const [posterVisible, setPosterVisible] = useState(false);

  useEffect(() => {
    if (showPoster) markPosterShown();
  }, [showPoster]);

  useEffect(() => {
    if (!isNative) return;
    const t = window.setTimeout(hideNative, MAX_NATIVE_MS);
    return () => window.clearTimeout(t);
  }, [isNative]);

  // Эстафета: нативный сплэш держим, пока его есть чем сменить.
  useEffect(() => {
    if (isNative && (showPoster ? posterVisible : ready)) hideNative();
  }, [isNative, showPoster, posterVisible, ready]);

  return showPoster ? <BootSplash ready={ready} onVisible={() => setPosterVisible(true)} /> : null;
};
