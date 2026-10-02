import React from "react";
import { Star } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { formatRating } from "@/shared/lib/utils/formatRating";

export const ratingTone = (value?: number | null) => {
  if (!value || value <= 0) return "text-muted-foreground";
  if (value >= 7.5) return "text-rating-high";
  if (value >= 6) return "text-rating-mid";
  return "text-rating-low";
};

const ratingBg = (value?: number | null) => {
  if (!value || value <= 0) return "bg-black/55";
  if (value >= 7.5) return "bg-rating-high";
  if (value >= 6) return "bg-rating-mid";
  return "bg-rating-low";
};

interface Props {
  value?: number | null;
  className?: string;
  /** solid — цветная плашка поверх постера, plain — цветной текст со звездой */
  variant?: "solid" | "plain";
}

export const RatingBadge: React.FC<Props> = ({
  value,
  className,
  variant = "solid",
}) => {
  if (variant === "plain") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-semibold tabular-nums",
          ratingTone(value),
          className,
        )}
      >
        <Star className="size-3.5 fill-current" />
        {formatRating(value)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-bold leading-none text-white tabular-nums shadow-sm",
        ratingBg(value),
        className,
      )}
    >
      {formatRating(value)}
    </span>
  );
};
