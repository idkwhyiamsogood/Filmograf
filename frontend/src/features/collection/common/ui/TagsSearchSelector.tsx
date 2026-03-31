"use client";

import { useState, type FC, useMemo } from "react";
import useDebounce from "react-use/esm/useDebounce";
import { useInfinityTags, useTagsSearch } from "@/entities/collection-tags";
import { CommonSearchSelector, type SearchItem } from "@/shared/components";
import { CommandEmpty } from "./CommandEmpty";
import { useModals } from "@/shared/hooks";

export const TagsSearchSelector: FC = () => {
  const { openModal } = useModals();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useDebounce(() => setDebouncedValue(searchValue), 300, [searchValue]);

  const {
    tags: infiniteTags,
    fetchNextPage,
    hasNextPage,
    isLoading: isInfiniteLoading,
  } = useInfinityTags({
    pageSize: 21,
  });

  const { data: searchedTags, isLoading: isSearchLoading } =
    useTagsSearch(debouncedValue.trim());

  const itemsToDisplay = useMemo((): SearchItem[] => {
    const sourceData = debouncedValue ? searchedTags || [] : infiniteTags || [];

    return sourceData.map(({ id, name }) => ({
      id,
      name,
    }));
  }, [debouncedValue, infiniteTags, searchedTags]);

  return (
    <CommonSearchSelector
      items={itemsToDisplay}
      onChangeValue={setSearchValue}
      commandEmpty={
        <CommandEmpty text={debouncedValue} handleOpenModal={openModal} />
      }
      onLoadMore={() => !debouncedValue && fetchNextPage?.()}
      hasNextPage={!debouncedValue && hasNextPage}
      isLoading={debouncedValue ? isSearchLoading : isInfiniteLoading}
    />
  );
};
