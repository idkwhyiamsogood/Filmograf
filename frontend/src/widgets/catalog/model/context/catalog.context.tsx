"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { EntityType } from "@/shared/types";
import { useFilter } from "@/features/filter/";
import { useSearch } from "@/features/search";

interface CatalogContextType {
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  query: string;
  activeType: EntityType;
  setQuery: (query: string) => void;
  setActiveType: (type: EntityType) => void;
  handleSearch: () => void;
}

export const CatalogContext = createContext<CatalogContextType | undefined>(
  undefined,
);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>("");
  const [activeType, setActiveType] = useState<EntityType>("Movie");

  const { filterState, updateFilterOption } = useFilter();

  useEffect(() => {
    updateFilterOption("targetType", () => activeType);
  }, [activeType, updateFilterOption]);

  const { data, isLoading, isFetching, refetch } = useSearch(
    query ?? "",
    filterState,
  );

  const handleSearch = () => {
    refetch();
  };

  const value = {
    data,
    isLoading,
    isFetching,
    query,
    activeType,
    setQuery,
    setActiveType,
    handleSearch,
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
