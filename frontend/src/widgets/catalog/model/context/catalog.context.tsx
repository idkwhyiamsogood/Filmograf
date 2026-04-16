"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import type { EntityType, IdsEntity } from "@/shared/types";
import { useFilter } from "@/features/filter/";
import { useSearch } from "@/features/search";

interface CatalogContextType {
  data: any;
  query: string;
  activeType: EntityType;
  setQuery: (query: string) => void;
  setActiveType: (type: EntityType) => void;
}

export const CatalogContext = createContext<CatalogContextType | undefined>(
  undefined,
);

export const CatalogProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState<string>("");
  const [activeType, setActiveType] = useState<EntityType>("Movie");

  const [searchedIds, setSearchedIds] = useState<IdsEntity | undefined>(undefined);

  const { filterState, updateFilterOption } = useFilter();

  useEffect(() => {
    updateFilterOption("targetType", () => activeType);
  }, [activeType, updateFilterOption]);

  // console.log(filterState, "filter-options");

  const { data, isLoading } = useSearch(query, filterState);

  // console.log(data, isLoading)

  // console.log(data, data || [], "searched-data");

  const value = {
    data,
    query,
    activeType,
    setQuery,
    setActiveType,
  };

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
};
