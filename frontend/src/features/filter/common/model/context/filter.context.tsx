import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import type { FilterState } from "../types/types";

interface FilterContextValue {
  filterState: FilterState;
  toggleTarget: () => void;
  globalReset: () => void;
  toggleStrictMatch: () => void;
  /** Применить черновик из шторки фильтров целиком */
  setFilters: (next: FilterState) => void;
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
      filterOptions: { targetType: "Movie" },
    },
  );

  const toggleTarget = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      filterOptions: {
        ...prev.filterOptions,
        targetType:
          prev.filterOptions.targetType === "Collection"
            ? "Movie"
            : "Collection",
      },
    }));
  }, []);

  const globalReset = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      filterOptions: { targetType: "Movie" },
      fromGradeTo: undefined,
      fromYearTo: undefined,
      ageRating: undefined,
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


  const setFilters = useCallback((next: FilterState) => setFilterState(next), []);

  return (
    <FilterContext.Provider
      value={{
        filterState,
        setFilters,

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
