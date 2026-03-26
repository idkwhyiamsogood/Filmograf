"use client";

import React, { useCallback } from "react";

import { useModals, useSwipe } from "@/shared/hooks";


import { FilterCommonHeader } from "./common/ui/FilterCommonHeader";
import { FilterContent } from "./ui/FilterModal/FilterContent";
import { FilterFooter } from "./ui/FilterModal/FilterFooter";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/shared/ui/sheet";
import { useFilter } from "./common/model/hooks/useFilter";

export const FilterModal: React.FC = () => {
  const { isOpen, closeModal } = useModals();

  const { translateY, isDragging, handlers } = useSwipe({
    isOpen,
    onClose: closeModal,
    threshold: 190,
    maxDrag: 200,
  });

  const { filterState, globalReset } =
    useFilter();

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
          <FilterCommonHeader title="Фильтры"/>

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
