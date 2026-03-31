"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useInfinityTags } from "@/entities/collection-tags/model/hooks/useInfinityTags";
import { useModals } from "@/shared/hooks";
import { useTagsFilter } from "../model/hooks/useTagsFilter";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

import { LoadingSplashScreen } from "@/shared/components";
import { FilterCommonBody } from "../../common/ui/FilterCommonBody";
import { FilterCommonFooter } from "../../common/ui/FIlterCommonFooter";
import { FilterCommonHeader } from "../../common/ui/FilterCommonHeader";

import type { BaseModalProps } from "@/shared/types";

export const FilterTagsModal: React.FC<BaseModalProps> = ({ isOpen }) => {
  const { closeModal } = useModals();
  const { handleTagReset, toggleTag, getTagState } = useTagsFilter();
  const { tags, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinityTags({ pageSize: 21 });

  const { ref, inView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [tags, searchQuery]);

  const handleClose = () => {
    handleTagReset();
    closeModal();
  };

  return (
    <div className="bg-background border-accent">
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetHeader>
          <SheetTitle className="sr-only" hidden>
            Фильтры тегов
          </SheetTitle>
          <SheetDescription className="sr-only" hidden>
            Выбор тегов для настройки поиска
          </SheetDescription>
        </SheetHeader>

        <SheetContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          showCloseButton={false}
          side="bottom"
          className="h-full w-full bg-background duration-100"
        >
          <FilterCommonHeader
            title="Теги"
            handleReset={handleTagReset}
            handleClose={handleClose}
            inputOptions={{
              placeholder: "Поиск по тегам",
              handleSearch: (val) => setSearchQuery(val),
            }}
          />

          {isLoading ? (
            <div className="flex items-center h-full">
              <LoadingSplashScreen />
            </div>
          ) : (
            <FilterCommonBody
              items={filteredTags}
              handleToggleItem={toggleTag}
              getStatus={getTagState}
              ref={ref}
            />
          )}

          <FilterCommonFooter handleSubmit={() => closeModal()} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
