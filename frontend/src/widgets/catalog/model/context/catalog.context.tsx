"use client";

import { useFilter } from "@/features/filter/";
import { hasActiveFilters as checkFilters } from "@/features/filter/common/model/lib/validateFilters";
import { useInfiniteSearch } from "@/features/search";
import type { EntityType } from "@/shared/types";
import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from "react";

interface CatalogContextType {
  entityIds: string[];
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

  const {
    entityIds,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useInfiniteSearch({
    value: query,
    filterOptions: filterState,
    params: { count: 20 },
  });

  const handleSearch = () => {
    refetch();
  };

  const value = {
    entityIds,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    query,
    activeType,
    hasActiveFilters: filtersActive,
    setQuery,
    setActiveType,
    handleSearch,
    fetchNextPage,
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
