"use client";

// types
import type { EntityType } from "@/shared/types";
import type { FC } from "react";

// ui
import { CommonCheckboxField } from "@/shared/components";
import { WrapperSheetContent } from "@/shared/components/";
import { Separator } from "@/shared/ui/separator";
import { ChevronRight } from "lucide-react";
import { Input } from "@/shared/ui/input";

// const
import { ratings } from "../../model/constants/ageRatings";

// hooks
import { useModals } from "@/shared/hooks";
import { useFilter } from "../../common/model/hooks/useFilter";
import { cn } from "@/shared/lib/utils";
import { validateFilters } from "../../common/model/lib/validateFilters";

interface Props {
  targetType: EntityType;
}

export const FilterContent: FC<Props> = ({ targetType }) => {
  const { openModal } = useModals();
  const { toggleStrictMatch, filterState, updateFilterOption } = useFilter();
  const validation = validateFilters(filterState);

  const selectedGenresCount =
    (filterState.filterOptions.genres?.include?.length || 0) +
    (filterState.filterOptions.genres?.exclude?.length || 0);

  const selectedTagsCount =
    (filterState.filterOptions.tags?.include?.length || 0) +
    (filterState.filterOptions.tags?.exclude?.length || 0);

  const isCollection = filterState.filterOptions.targetType === "Collection";

  const handleRangeChange = (
    key: "fromYearTo" | "fromGradeTo",
    index: 0 | 1,
    value: string
  ) => {
    updateFilterOption(key, (prev) => {
      const newRange = [...(prev || ["", ""])];
      newRange[index] = value;
      return newRange as any;
    });
  };

  const handleAgeRatingToggle = (id: number) => {
    updateFilterOption("ageRating", (prev) => {
      const current = prev || [];
      return current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
    });
  };

  console.log(filterState);

  return (
    <div className="my-11 h-max">
      <WrapperSheetContent>
        <div
          className="flex justify-between items-center py-2.5 max-h-10 h-10 cursor-pointer"
          onClick={() => openModal("search-genres-filter")}
        >
          <p className="text-sm font-bold">Жанры</p>

          <div className="flex gap-1 items-center text-[12px] text-muted-foreground/70">
            {selectedGenresCount > 0
              ? `Выбрано ${selectedGenresCount}...`
              : "Любые"}
            <ChevronRight size={16} />
          </div>
        </div>
      </WrapperSheetContent>

      <Separator />

      <WrapperSheetContent>
        <div
          className={cn(
            "flex justify-between items-center py-2.5 max-h-10 h-10 transition-all",
            isCollection
              ? "cursor-pointer hover:bg-accent/50"
              : "opacity-40 cursor-not-allowed pointer-events-none select-none",
          )}
          onClick={() => isCollection && openModal("search-tags-filter")}
        >
          <p className="text-sm font-bold">Теги</p>

          <div className="flex gap-1 items-center text-[12px] text-muted-foreground/70">
            {!isCollection
              ? "Только для коллекций"
              : selectedTagsCount > 0
                ? `Выбрано ${selectedTagsCount}...`
                : "Любые"}
            <ChevronRight
              size={16}
              className={cn(!isCollection && "invisible")}
            />
          </div>
        </div>
      </WrapperSheetContent>

      <Separator />

      <WrapperSheetContent>
        <div className="flex justify-between items-center py-2.5 max-h-10 h-10 my-1">
          <CommonCheckboxField
            label="Строгое совпадение"
            handleToggle={toggleStrictMatch}
            checked={filterState.strictMatch}
          />
        </div>
      </WrapperSheetContent>

      <Separator />

      {filterState.filterOptions.targetType === "Movie" && (
        <div className="space-y-2.5">
          <WrapperSheetContent>
            <div className="py-1 flex flex-col gap-1">
              <span className="text-[14px] font-sans text-accent-foreground">
                Год релиза
              </span>
              <div className="flex justify-between items-center">
                <Input
                  placeholder="От"
                  type="number"
                  value={filterState.filterOptions.fromYearTo?.[0] || ""}
                  onChange={(e) => handleRangeChange("fromYearTo", 0, e.target.value)}
                  className="w-full h-7.5 px-[6px] py-[2px] text-[13px] rounded-[5px]"
                />
                <span className="w-4 h-[1px] bg-[#8a8a8e] shrink-0 mx-2"></span>
                <Input
                  placeholder="До"
                  type="number"
                  value={filterState.filterOptions.fromYearTo?.[1] || ""}
                  onChange={(e) => handleRangeChange("fromYearTo", 1, e.target.value)}
                  className="w-full h-7.5 px-[6px] py-[2px] text-[13px] rounded-[5px]"
                />
              </div>
              {validation.errors.fromYearTo && (
                <div className="text-[12px] text-red-600">
                  {validation.errors.fromYearTo}
                </div>
              )}
            </div>
          </WrapperSheetContent>

          <WrapperSheetContent>
            <div className="py-1 flex flex-col gap-1">
              <span className="text-[14px] font-sans text-accent-foreground">
                Оценка
              </span>
              <div className="flex justify-between items-center">
                <Input
                  placeholder="От"
                  type="number"
                  value={filterState.filterOptions.fromGradeTo?.[0] || ""}
                  onChange={(e) => handleRangeChange("fromGradeTo", 0, e.target.value)}
                  className="w-full h-7.5 px-[6px] py-[2px] text-[13px] rounded-[5px]"
                />
                <span className="w-4 h-[1px] bg-[#8a8a8e] shrink-0 mx-2"></span>
                <Input
                  placeholder="До"
                  type="number"
                  value={filterState.filterOptions.fromGradeTo?.[1] || ""}
                  onChange={(e) => handleRangeChange("fromGradeTo", 1, e.target.value)}
                  className="w-full h-7.5 px-[6px] py-[2px] text-[13px] rounded-[5px]"
                />
              </div>
              {validation.errors.fromGradeTo && (
                <div className="text-[12px] text-red-600">
                  {validation.errors.fromGradeTo}
                </div>
              )}
            </div>
          </WrapperSheetContent>

          <Separator />

          <WrapperSheetContent>
            <span className="text-[14px] mb-2 block font-sans text-accent-foreground">
              Возрастные ограничения
            </span>
            <div className="flex flex-wrap gap-2.5">
              {ratings.map((rate) => (
                <div key={"rating-" + rate.id} className="w-[calc(50vw-20px)]">
                  <CommonCheckboxField
                    label={String(rate.value) + "+"}
                    checked={filterState.filterOptions.ageRating?.includes(rate.id) || false}
                    handleToggle={() => handleAgeRatingToggle(rate.id)}
                  />
                </div>
              ))}
            </div>
          </WrapperSheetContent>
        </div>
      )}
    </div>
  );
};