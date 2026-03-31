"use client";

// types
import type { FC } from "react";
import type { BaseModalProps } from "@/shared/types";

// ui
import { FilterCommonHeader } from "./common/ui/FilterCommonHeader";
import { FilterContent } from "./ui/FilterModal/FilterContent";
import { FilterFooter } from "./ui/FilterModal/FilterFooter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

// hooks
import { useCallback } from "react";
import { useModals, useSwipe } from "@/shared/hooks";
import { useFilter } from "./common";

export const FilterModal: FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { filterState, globalReset } = useFilter();

  const { translateY, isDragging, handlers } = useSwipe({
    onClose: closeModal,
    threshold: 190,
    maxDrag: 200,
  });

  const handleSubmit = useCallback(() => {
    try {
      console.log("filter handled", filterState.filterOptions);
    } catch (e) {
      console.log();
    }
  }, []);

  return (
    <div className="bg-background border-accent">
      <Sheet open={isOpen} onOpenChange={closeModal}>
        <SheetHeader>
          <SheetTitle hidden>Фильтры</SheetTitle>
          <SheetDescription hidden>
            Выбор фильтров для настройки поиска
          </SheetDescription>
        </SheetHeader>

        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          side="bottom"
          className={`
            h-full
            w-full
            bg-background 
            data-[state=open]:animate-in 
            data-[state=open]:slide-in-from-bottom 
            data-[state=closed]:animate-out 
            data-[state=closed]:slide-out-to-top
            duration-100
          `}
          style={{
            transform: `translateY(${translateY}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            touchAction: "pan-y",
          }}
          showCloseButton={false}
          {...handlers}
        >
          <FilterCommonHeader title="Фильтры" handleClose={closeModal} />

          <FilterContent targetType={filterState.filterOptions.targetType} />

          <FilterFooter
            handleResetFilter={globalReset}
            handleSubmit={handleSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
