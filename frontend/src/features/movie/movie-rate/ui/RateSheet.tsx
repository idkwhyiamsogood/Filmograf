import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { Poster } from "@/shared/ui/poster";
import { cn } from "@/shared/lib/utils";

import { useRateMovie } from "../model/hooks/useRateMovie";

const LABELS: Record<number, string> = {
  1: "Ужасно", 2: "Очень плохо", 3: "Плохо", 4: "Так себе", 5: "Средне",
  6: "Неплохо", 7: "Хорошо", 8: "Отлично", 9: "Великолепно", 10: "Шедевр",
};

const tone = (n: number) =>
  n >= 8 ? "text-rating-high" : n >= 6 ? "text-rating-mid" : n > 0 ? "text-rating-low" : "text-muted-foreground/40";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: string;
  movieName: string;
  poster?: string;
  current?: number;
}

/**
 * Ряд из 10 звёзд: можно ткнуть или провести пальцем — оценка едет за ним.
 * Над рядом — крупная цифра с подписью, цвет по шкале (красный → зелёный).
 */
const StarScale: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  const pick = (clientX: number) => {
    const row = rowRef.current;
    if (!row) return 0;
    const { left, width } = row.getBoundingClientRect();
    return Math.min(10, Math.max(1, Math.ceil(((clientX - left) / width) * 10)));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex h-24 flex-col items-center justify-center">
        <span
          key={shown}
          className={cn(
            "text-6xl leading-none font-extrabold tabular-nums transition-colors duration-200",
            tone(shown),
            shown && "animate-[score-pop_220ms_ease-out]",
          )}
        >
          {shown || "—"}
        </span>
        <span className="mt-2 text-sm font-semibold text-muted-foreground">
          {shown ? LABELS[shown] : "Проведите по звёздам"}
        </span>
      </div>

      <div
        ref={rowRef}
        data-sheet-no-drag
        role="slider"
        aria-label="Оценка от 1 до 10"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value || undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(10, (value || 0) + 1));
          if (e.key === "ArrowLeft") onChange(Math.max(1, (value || 2) - 1));
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onChange(pick(e.clientX));
        }}
        onPointerMove={(e) => {
          if (e.buttons) onChange(pick(e.clientX));
          else if (e.pointerType === "mouse") setHover(pick(e.clientX));
        }}
        onPointerLeave={() => setHover(0)}
        className="flex w-full touch-none justify-between px-1 outline-none select-none"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const filled = n <= shown;
          return (
            <Star
              key={n}
              aria-hidden
              className={cn(
                "size-[26px] transition-all duration-150",
                filled ? cn("fill-current", tone(shown)) : "text-muted-foreground/30",
                filled && n === shown && "scale-115",
              )}
              strokeWidth={1.6}
            />
          );
        })}
      </div>
      <div className="flex w-full justify-between px-1.5 text-[11px] font-semibold text-muted-foreground">
        <span>1 — ужасно</span>
        <span>10 — шедевр</span>
      </div>
    </div>
  );
};

export const RateSheet: React.FC<Props> = ({ open, onOpenChange, movieId, movieName, poster, current }) => {
  const [value, setValue] = useState(current && current > 0 ? current : 0);
  const { mutate } = useRateMovie();

  useEffect(() => {
    if (open) setValue(current && current > 0 ? current : 0);
  }, [open, current]);

  const isUpdate = Boolean(current && current > 0);

  const submit = () => {
    if (!value) return;
    // Оптимистично: оценка уже на экране, шторку закрываем сразу.
    mutate({ rate: value, id: movieId });
    onOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdate ? "Изменить оценку" : "Ваша оценка"}
      description={
        <span className="flex items-center gap-2">
          {poster && (
            <span className="w-6 shrink-0">
              <Poster src={poster} alt="" width={24} rounded="rounded-[4px]" />
            </span>
          )}
          <span className="truncate">{movieName}</span>
        </span>
      }
      footer={
        <Button
          size="lg"
          className="mb-1 h-12 w-full rounded-xl text-[15px] font-bold"
          disabled={!value || value === current}
          onClick={submit}
        >
          {value ? `${isUpdate ? "Сохранить" : "Оценить на"} ${value}` : "Выберите оценку"}
        </Button>
      }
    >
      <div className="pt-2 pb-4">
        <StarScale value={value} onChange={setValue} />
      </div>
    </BottomSheet>
  );
};
