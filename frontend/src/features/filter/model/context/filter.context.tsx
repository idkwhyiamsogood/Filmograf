"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

import type { FilterState } from "../types/types";

interface FilterContextValue {
  filterState: FilterState;
  toggleTarget: () => void;
  globalReset: () => void;
  toggleStrictMatch: () => void;
  updateFilterOption: <K extends keyof FilterState["filterOptions"]>(
    key: K,
    updater: (
      prev: FilterState["filterOptions"][K],
    ) => FilterState["filterOptions"][K],
  ) => void;
}

export const FilterContext = createContext<FilterContextValue | undefined>(
  undefined,
);

interface FilterProviderProps {
  children: ReactNode;
  initialState?: FilterState;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({
  children,
  initialState,
}) => {
  const [filterState, setFilterState] = useState<FilterState>(
    initialState ?? {
      strictMatch: false,
      filterOptions: { targetType: "movie" },
    },
  );

  const toggleTarget = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      filterOptions: {
        ...prev.filterOptions,
        targetType:
          prev.filterOptions.targetType === "collection"
            ? "movie"
            : "collection",
      },
    }));
  }, []);

  const globalReset = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      filterOptions: { targetType: "movie" },
    }));
  }, []);

  const toggleStrictMatch = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      strictMatch: !prev.strictMatch,
    }));
  }, []);

  const updateFilterOption = useCallback(
    <K extends keyof FilterState["filterOptions"]>(
      key: K,
      updater: (
        prev: FilterState["filterOptions"][K],
      ) => FilterState["filterOptions"][K],
    ) => {
      setFilterState((prev) => ({
        ...prev,
        filterOptions: {
          ...prev.filterOptions,
          [key]: updater(prev.filterOptions[key]),
        },
      }));
    },
    [],
  );

  useEffect(() => {
    console.log(filterState);
  }, [filterState]);

  return (
    <FilterContext.Provider
      value={{
        filterState,
        toggleTarget,
        globalReset,
        updateFilterOption,
        toggleStrictMatch,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
