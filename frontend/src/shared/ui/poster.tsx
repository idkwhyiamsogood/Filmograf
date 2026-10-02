import React, { useState } from "react";
import { Clapperboard } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { imageSrcSet, optimizeImage } from "@/shared/lib/utils/optimizeImage";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  /** Пропорции контейнера, по умолчанию постер 2:3 */
  ratio?: "poster" | "backdrop" | "square";
  priority?: boolean;
  rounded?: string;
  /** Ширина картинки на экране в CSS-пикселях — под неё ресайзим на прокси */
  width?: number;
}

const RATIO = {
  poster: "aspect-[2/3]",
  backdrop: "aspect-video",
  square: "aspect-square",
};

/**
 * Изображение с ресайзом/WebP через прокси, плавным появлением и заглушкой.
 * Если прокси недоступен — один раз пробуем оригинальный URL.
 */
export const Poster: React.FC<Props> = ({
  src,
  alt,
  className,
  ratio = "poster",
  priority,
  rounded = "rounded-xl",
  width = 160,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  const [failed, setFailed] = useState(!src);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted",
        RATIO[ratio],
        rounded,
        !loaded && !failed && "animate-pulse",
        className,
      )}
    >
      {!failed && (
        <img
          src={useOriginal ? src ?? undefined : optimizeImage(src, width)}
          srcSet={useOriginal ? undefined : imageSrcSet(src, width)}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => (useOriginal ? setFailed(true) : setUseOriginal(true))}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-accent p-2 text-center text-muted-foreground">
          <Clapperboard className="size-6 opacity-60" />
          <span className="line-clamp-2 text-[11px] font-medium">{alt}</span>
        </div>
      )}
    </div>
  );
};
