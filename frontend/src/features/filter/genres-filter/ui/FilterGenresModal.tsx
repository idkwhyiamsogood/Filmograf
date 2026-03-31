"use client";

import React, { useEffect, useState } from "react";

import { GenreType, useGenres } from "@/entities/genres";
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
import { LoadingSplashScreen } from "@/shared/components";

import type { BaseModalProps } from "@/shared/types";

export const FilterGenresModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { handleGenresReset, toggleGenre, getGenreState } = useGenresFilter();
  const { data: genres, isLoading } = useGenres();

  const [data, setData] = useState<GenreType[]>(genres);

  useEffect(() => {
    setData(genres);
  }, [isLoading]);

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

  const handleClose = () => {
    handleGenresReset();
    closeModal();
  };

  return (
    <div className="bg-background border-accent">
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetHeader>
          <SheetTitle className="sr-only" hidden>
            Фильтры
          </SheetTitle>
          <SheetDescription className="sr-only" hidden>
            Выбор фильтров для настройки поиска
          </SheetDescription>
        </SheetHeader>

        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
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
            duration-200
          `}
        >
          <FilterCommonHeader
            title="Жанры"
            handleReset={handleGenresReset}
            handleClose={handleClose}
            inputOptions={{
              placeholder: "Поиск по жарнам",
              handleSearch: handleSearch,
            }}
          />

          {isLoading ? (
            <div className="h-full flex items-center">
              <LoadingSplashScreen />
            </div>
          ) : (
            <FilterCommonBody
              items={data}
              handleToggleItem={toggleGenre}
              getStatus={getGenreState}
            />
          )}

          <FilterCommonFooter
            handleSubmit={() => console.log("submitet genres modal")}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
