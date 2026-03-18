"use client";

import React, { useEffect } from "react";

import { useModals } from "@/shared/hooks";
import { useGenresFilter } from "./model/hooks/useGenresFilter";
import { useGenres } from "@/entities/genres";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import { FilterCommonHeader } from "./ui/common/modal/FilterCommonHeader";
import { FilterCommonBody } from "./ui/common/modal/FilterCommonBody";
import { FilterCommonFooter } from "./ui/common/modal/FIlterCommonFooter";

export const FilterGenresModal: React.FC = () => {
  const { isOpen, closeModal } = useModals();
  const { handleGenresReset, toggleGenre, getGenreState } = useGenresFilter();

  const { data } = useGenres();

  useEffect(() => {
    console.log(data);
  }, [data])

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
          showCloseButton={false}
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
        >
          <FilterCommonHeader title="Жанры" handleReset={handleGenresReset} />
          
          <FilterCommonBody
            items={data?.data || []}
            handleToggleItem={toggleGenre}
            getStatus={getGenreState}
          />
          <FilterCommonFooter
            handleSubmit={() => console.log("submitet genres modal")}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
