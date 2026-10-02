import { useEffect, useState, type CSSProperties, type FC } from "react";

import { cn } from "@/shared/lib/utils";

import { buildPoster, FONT, loadPosterFont, PANEL, type PosterLine } from "./poster";

const MIN_VISIBLE_MS = 1700;
const FADE_MS = 450;

/** Единица макета: панель 281×595 вписывается в экран целиком. */
const u = (n: number) => `calc(var(--pu) * ${n})`;

/** Органичные пятна макета (shape-27335) — SVG, чтобы были чёткими на любом экране. */
const Blobs: FC = () => (
  <svg
    viewBox={`0 0 ${PANEL.w} ${PANEL.h}`}
    className="absolute inset-0 h-full w-full overflow-visible"
    aria-hidden
  >
    <defs>
      <linearGradient id="splash-violet" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3FA9F0" />
        <stop offset="0.45" stopColor="#8E5CF3" />
        <stop offset="1" stopColor="#FF00FF" />
      </linearGradient>
      <linearGradient id="splash-cyan" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#42A5F5" />
        <stop offset="1" stopColor="#00D6E0" />
      </linearGradient>
    </defs>
    <g className="origin-[30%_30%] animate-[blob-drift_9s_ease-in-out_infinite_alternate]">
      <path
        fill="url(#splash-violet)"
        d="M-60 -70 C 90 -110 238 -60 252 70 C 266 196 214 322 104 376 C 24 414 -66 392 -84 300 C -100 220 -110 -50 -60 -70 Z"
      />
    </g>
    <g className="origin-[10%_95%] animate-[blob-drift_11s_ease-in-out_infinite_alternate-reverse]">
      <path
        fill="url(#splash-cyan)"
        d="M-60 512 C 10 486 110 488 152 532 C 186 568 174 616 156 640 L -60 640 Z"
      />
    </g>
  </svg>
);

const Line: FC<{ line: PosterLine; index: number }> = ({ line, index }) => {
  const vertical = line.dir === "v";
  const style: CSSProperties = {
    left: u(line.x),
    top: u(line.y),
    fontSize: u(line.size),
    // Вертикальные: поворот вокруг левого-верхнего угла, текст идёт вверх.
    transform: vertical ? "rotate(-90deg)" : undefined,
    transformOrigin: "0 0",
  };

  return (
    <span className="absolute leading-none whitespace-nowrap" style={style}>
      <span
        className="block animate-[poster-line_620ms_cubic-bezier(0.32,0.72,0,1)_both]"
        style={{ animationDelay: `${120 + index * 55}ms` }}
      >
        {line.text}
      </span>
    </span>
  );
};

/**
 * Заставка при запуске — постер из макета Figma: буква F из фраз Montserrat
 * ExtraBold на цветных пятнах, тонкая диагональ. Пятна медленно дрейфуют и
 * переливаются (transform + hue-rotate на одном слое), строки появляются
 * по очереди. Три точки — индикатор загрузки.
 */
export const BootSplash: FC<{ ready: boolean }> = ({ ready }) => {
  const [lines, setLines] = useState<PosterLine[] | null>(null);
  const [minElapsed, setMinElapsed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  // Раскладку считаем, когда подгрузился Montserrat — иначе кегли поплывут.
  useEffect(() => {
    let alive = true;
    loadPosterFont().then(() => alive && setLines(buildPoster()));
    const t = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  // Отдельные эффекты: смена leaving не должна отменять таймер скрытия.
  useEffect(() => {
    if (ready && minElapsed) setLeaving(true);
  }, [ready, minElapsed]);

  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background transition-opacity ease-out",
        leaving && "pointer-events-none opacity-0",
      )}
      style={{
        transitionDuration: `${FADE_MS}ms`,
        ["--pu" as string]: `min(100vw / ${PANEL.w}, 100dvh / ${PANEL.h})`,
      }}
    >
      <div className="relative" style={{ width: u(PANEL.w), height: u(PANEL.h) }}>
        <div className="absolute inset-0 animate-[blob-hue_7s_ease-in-out_infinite_alternate]" style={{ willChange: "filter" }}>
          <Blobs />
        </div>

        {/* тонкая диагональ, как в макете */}
        <svg viewBox={`0 0 ${PANEL.w} ${PANEL.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <line
            x1="233"
            y1="0"
            x2="184"
            y2={PANEL.h}
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-foreground [stroke-dasharray:600] animate-[poster-stroke_1s_cubic-bezier(0.32,0.72,0,1)_both]"
          />
        </svg>

        <div
          className="absolute inset-0 text-foreground"
          style={{ fontFamily: `${FONT}, Arial, sans-serif`, fontWeight: 800 }}
        >
          {lines?.map((line, i) => <Line key={i} line={line} index={i} />)}
        </div>
      </div>

      <span className="absolute bottom-[calc(env(safe-area-inset-bottom)+28px)] left-1/2 flex -translate-x-1/2 gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-foreground animate-[splash-dot_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
    </div>
  );
};
