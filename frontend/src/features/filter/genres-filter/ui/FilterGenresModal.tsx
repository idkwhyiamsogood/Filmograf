"use client";

import React, { useState } from "react";

import { Genre, useGenres } from "@/entities/genres";
import { useModals } from "@/shared/hooks";
import { useGenresFilter } from "../model/hooks/useGenresFilter";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import { FilterCommonBody } from "../../common/ui/FilterCommonBody";
import { FilterCommonFooter } from "../../common/ui/FIlterCommonFooter";
import { FilterCommonHeader } from "../../common/ui/FilterCommonHeader";

export const FilterGenresModal: React.FC = () => {
  const { isOpen, closeModal } = useModals();
  const { handleGenresReset, toggleGenre, getGenreState } = useGenresFilter();
  const { data: genres } = useGenres();

  const [data, setData] = useState<Genre[]>(genres);

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setData(genres);
      return;
    }

    const filtered = (genres || []).filter((genre) =>
      genre.name.toLowerCase().includes(value.toLowerCase()),
    );

    setData(filtered);
  };

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
          <FilterCommonHeader
            title="Жанры"
            handleReset={handleGenresReset}
            inputOptions={{
              placeholder: "Поиск по жарнам",
              handleSearch: handleSearch,
            }}
          />

          <FilterCommonBody
            items={data}
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
