export type AppLink = { kind: "movie" | "collection"; id: string; path: string };

// Только роуты, которые реально есть в приложении (routes/movies/$id, routes/collections/$id).
const ROUTES: { kind: AppLink["kind"]; re: RegExp; to: (id: string) => string }[] = [
  { kind: "movie", re: /^\/movies\/([A-Za-z0-9_-]{1,64})\/?$/, to: (id) => `/movies/${id}` },
  { kind: "collection", re: /^\/collections\/([A-Za-z0-9_-]{1,64})\/?$/, to: (id) => `/collections/${id}` },
];

const hostOf = (url?: string) => {
  try {
    return url ? new URL(url).hostname : undefined;
  } catch {
    return undefined;
  }
};

/** Наши домены: прод, адрес API из .env, текущий хост (dev/Capacitor). */
const KNOWN_HOSTS = new Set(
  [
    "filmograf.online",
    "www.filmograf.online",
    hostOf(import.meta.env.VITE_API_URL),
    typeof location !== "undefined" ? location.hostname : undefined,
  ].filter(Boolean) as string[],
);

/**
 * Вытащить из текста буфера ссылку на экран приложения.
 * Принимает полный URL нашего домена или путь «/movies/…».
 */
export const parseAppLink = (raw: string | null | undefined): AppLink | null => {
  const text = raw?.trim();
  if (!text || text.length > 2000) return null;

  let path: string | null = null;
  const urlMatch = text.match(/https?:\/\/[^\s"'<>]+/i);

  if (urlMatch) {
    try {
      const url = new URL(urlMatch[0]);
      if (!KNOWN_HOSTS.has(url.hostname)) return null;
      path = url.pathname;
    } catch {
      return null;
    }
  } else if (/^\/[^\s]+$/.test(text)) {
    path = text;
  }

  if (!path) return null;

  for (const route of ROUTES) {
    const m = path.match(route.re);
    if (m) return { kind: route.kind, id: m[1], path: route.to(m[1]) };
  }
  return null;
};
