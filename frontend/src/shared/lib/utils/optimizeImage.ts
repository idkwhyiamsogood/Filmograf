/**
 * Сжатие картинок через публичный ресайзер (по умолчанию images.weserv.nl).
 * Next.js делал это сам через /_next/image, во Vite такого нет — без этого
 * телефон качал постеры в исходном размере.
 *
 * VITE_IMAGE_PROXY=off — отключить, или указать свой хост с тем же API.
 */
const PROXY = (import.meta.env.VITE_IMAGE_PROXY ?? "https://wsrv.nl").replace(/\/$/, "");
const ENABLED = PROXY !== "off" && PROXY !== "";

const isRemote = (url?: string | null): url is string =>
  Boolean(url) && /^https?:\/\//i.test(url!);

export const optimizeImage = (url: string | null | undefined, width: number, quality = 72) => {
  if (!isRemote(url) || !ENABLED) return url ?? undefined;
  const params = new URLSearchParams({
    url,
    w: String(Math.round(width)),
    output: "webp",
    q: String(quality),
    // не растягивать маленькие исходники
    we: "",
  });
  return `${PROXY}/?${params.toString()}`;
};

/** srcset под плотность экрана: базовая ширина ×1, ×2, ×3. */
export const imageSrcSet = (url: string | null | undefined, width: number) => {
  if (!isRemote(url) || !ENABLED) return undefined;
  return [1, 2, 3].map((d) => `${optimizeImage(url, width * d)} ${d}x`).join(", ");
};
