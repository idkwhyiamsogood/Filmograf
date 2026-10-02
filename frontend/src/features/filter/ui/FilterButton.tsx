import type { FC } from "react";
import { SlidersHorizontal } from "lucide-react";

import { useModals } from "@/shared/contexts/modal-context";
import { cn } from "@/shared/lib/utils";

import { useFilter } from "../common";

/** Сколько групп фильтров включено — показываем бейджем на кнопке. */
const useActiveFiltersCount = () => {
  const { filterState } = useFilter();
  const fo = filterState.filterOptions;
  const has = (q?: { include?: string[]; exclude?: string[] }) =>
    (q?.include?.length ?? 0) + (q?.exclude?.length ?? 0) > 0;

  return [
    has(fo.genres),
    fo.targetType === "Collection" && has(fo.tags),
    fo.targetType === "Movie" && Boolean(fo.fromYearTo?.[0] && fo.fromYearTo?.[1]),
    fo.targetType === "Movie" && fo.fromGradeTo?.[0] != null && fo.fromGradeTo?.[1] != null,
    fo.targetType === "Movie" && (fo.ageRating?.length ?? 0) > 0,
    filterState.strictMatch,
  ].filter(Boolean).length;
};

export const FilterButton: FC = () => {
  const { openModal } = useModals();
  const count = useActiveFiltersCount();

  return (
    <button
      type="button"
      aria-label={count ? `Фильтры, включено: ${count}` : "Фильтры"}
      onClick={() => openModal("search-filter")}
      className={cn(
        "press relative flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
        count ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
      )}
    >
      <SlidersHorizontal className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background ring-2 ring-background">
          {count}
        </span>
      )}
    </button>
  );
};
