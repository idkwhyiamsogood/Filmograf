import React, { useState } from "react";
import { Clapperboard } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  /** Пропорции контейнера, по умолчанию постер 2:3 */
  ratio?: "poster" | "backdrop" | "square";
  priority?: boolean;
  rounded?: string;
}

const RATIO = {
  poster: "aspect-[2/3]",
  backdrop: "aspect-video",
  square: "aspect-square",
};

/**
 * Изображение с плавным появлением и заглушкой: пока картинка грузится —
 * мерцающий фон, если не загрузилась — иконка вместо «битой» картинки.
 */
export const Poster: React.FC<Props> = ({
  src,
  alt,
  className,
  ratio = "poster",
  priority,
  rounded = "rounded-xl",
}) => {
  const [loaded, setLoaded] = useState(false);
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
          src={src ?? undefined}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
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
