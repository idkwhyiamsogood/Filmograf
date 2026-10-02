import { useCallback, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { Clipboard } from "@capacitor/clipboard";
import { Preferences } from "@capacitor/preferences";

import { movieApi } from "@/entities/movie";
import { collectionApi } from "@/entities/collection";
import { useModals } from "@/shared/contexts/modal-context";
import { usePathname } from "@/shared/lib/router-compat";
import { formatDuration, pluralize } from "@/shared/lib";

import { parseAppLink } from "./parseAppLink";

const LAST_KEY = "clipboard-last-handled";
// Даём заставке уйти, прежде чем показывать шторку.
const FIRST_CHECK_DELAY = 1800;

const readClipboard = async (): Promise<string> => {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Clipboard.read();
    return value ?? "";
  }
  // В браузере читаем только если доступ уже выдан — без системного запроса.
  try {
    const perm = await navigator.permissions?.query({ name: "clipboard-read" as PermissionName });
    if (perm?.state !== "granted") return "";
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
};

/**
 * При запуске и при возвращении в приложение смотрим буфер обмена: если там
 * ссылка на существующий фильм/подборку — предлагаем открыть. Один и тот же
 * текст предлагаем один раз.
 */
export const useClipboardLink = (enabled: boolean) => {
  const { openModal } = useModals();
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const busy = useRef(false);

  const check = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      const text = (await readClipboard()).trim();
      if (!text) return;

      const { value: last } = await Preferences.get({ key: LAST_KEY });
      if (last === text) return;
      await Preferences.set({ key: LAST_KEY, value: text });

      const link = parseAppLink(text);
      if (!link || pathRef.current === link.path) return;

      // Проверяем, что экран действительно существует (и доступен).
      if (link.kind === "movie") {
        const { data } = await movieApi.batchMany({ ids: [link.id] });
        const movie = data?.[0];
        if (!movie) return;
        openModal("clipboard-link", {
          path: link.path,
          kind: "movie",
          title: movie.name,
          subtitle: [movie.year, formatDuration(movie.time)].filter(Boolean).join(" · "),
          poster: movie.imageUrl,
        });
      } else {
        const { data: collection } = await collectionApi.getCollection(link.id);
        if (!collection || collection.isDeleted) return;
        openModal("clipboard-link", {
          path: link.path,
          kind: "collection",
          title: collection.name,
          subtitle: `Подборка · ${pluralize(collection.movies.length, ["фильм", "фильма", "фильмов"])}`,
          poster: collection.moviePreviews[0],
        });
      }
    } catch {
      // нет доступа к буферу / сущность не найдена — молча пропускаем
    } finally {
      busy.current = false;
    }
  }, [openModal]);

  useEffect(() => {
    if (!enabled) return;
    const t = window.setTimeout(check, FIRST_CHECK_DELAY);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, check]);
};
