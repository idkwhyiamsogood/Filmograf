import React, { useEffect, useState } from "react";

import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { useRateMovie } from "../model/hooks/useRateMovie";

const LABELS: Record<number, string> = {
  1: "Ужасно", 2: "Очень плохо", 3: "Плохо", 4: "Так себе", 5: "Средне",
  6: "Неплохо", 7: "Хорошо", 8: "Отлично", 9: "Великолепно", 10: "Шедевр",
};

const tone = (n: number) =>
  n >= 8 ? "bg-rating-high" : n >= 6 ? "bg-rating-mid" : "bg-rating-low";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieId: string;
  movieName: string;
  current?: number;
}

export const RateSheet: React.FC<Props> = ({ open, onOpenChange, movieId, movieName, current }) => {
  const [value, setValue] = useState(current && current > 0 ? current : 0);
  const { mutate, isPending } = useRateMovie();

  useEffect(() => {
    if (open) setValue(current && current > 0 ? current : 0);
  }, [open, current]);

  const submit = () => {
    if (!value) return;
    mutate({ rate: value, id: movieId }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Ваша оценка"
      description={movieName}
      footer={
        <Button
          size="lg"
          className="mb-3 h-12 w-full rounded-xl text-base font-bold"
          disabled={!value || isPending || value === current}
          onClick={submit}
        >
          {current && current > 0 ? "Изменить оценку" : "Оценить"}
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-5 py-2">
        <div className="flex h-20 flex-col items-center justify-center">
          <span
            className={cn(
              "text-5xl font-extrabold tabular-nums transition-colors",
              value ? "text-foreground" : "text-muted-foreground/40",
            )}
          >
            {value || "—"}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {value ? LABELS[value] : "Выберите от 1 до 10"}
          </span>
        </div>

        <div className="grid w-full grid-cols-5 gap-2" role="radiogroup" aria-label="Оценка">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const active = n === value;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`${n} — ${LABELS[n]}`}
                onClick={() => setValue(n)}
                className={cn(
                  "press h-12 rounded-xl text-lg font-bold tabular-nums transition-all",
                  active
                    ? cn(tone(n), "scale-105 text-white shadow-lg")
                    : n <= value
                      ? "bg-brand-soft text-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
};
