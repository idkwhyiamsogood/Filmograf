"use client";

import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useFilter } from "@/features/filter/";
import { hasActiveFilters as checkFilters } from "@/features/filter/common/model/lib/validateFilters";
import {
  useInfiniteMovieSearch,
  useInfiniteCollectionSearch,
} from "@/features/search";
import type { EntityType } from "@/shared/types";
import type { IMovie } from "@/entities/movie";
import { Collection } from "@/entities/collection";

interface CatalogContextType {
  // Используем объединение типов для универсальности
  items: (IMovie | Collection)[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  query: string;
  activeType: EntityType;
  hasActiveFilters: boolean;
  setQuery: (query: string) => void;
  setActiveType: (type: EntityType) => void;
  handleSearch: () => void;
  fetchNextPage: () => void;
}

export const CatalogContext = createContext<CatalogContextType | undefined>(
  undefined,
);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>("");
  const [activeType, setActiveType] = useState<EntityType>("Movie");

  const { filterState, updateFilterOption } = useFilter();
  const filtersActive = checkFilters(filterState);

  useEffect(() => {
    updateFilterOption("targetType", () => activeType);
  }, [activeType, updateFilterOption]);

  const movieSearch = useInfiniteMovieSearch({
    value: query,
    filterOptions: filterState,
  });

  const collectionSearch = useInfiniteCollectionSearch({
    value: query,
    filterOptions: filterState,
  });

  const currentSearch = activeType === "Movie" ? movieSearch : collectionSearch;

  const items = useMemo(() => {
    if (!currentSearch.data) return [];

    return currentSearch.data.pages.flatMap<IMovie | Collection>(
      (page) => page.items,
    );
  }, [currentSearch.data]);

  const handleSearch = () => {
    currentSearch.refetch();
  };

  const value = useMemo(
    () => ({
      items,
      isLoading: currentSearch.isLoading,
      isFetching: currentSearch.isFetching,
      isFetchingNextPage: currentSearch.isFetchingNextPage,
      hasNextPage: currentSearch.hasNextPage,
      query,
      activeType,
      hasActiveFilters: filtersActive,
      setQuery,
      setActiveType,
      handleSearch,
      fetchNextPage: currentSearch.fetchNextPage,
    }),
    [items, currentSearch, query, activeType, filtersActive],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
