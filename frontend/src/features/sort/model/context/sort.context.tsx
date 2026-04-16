import React, { createContext, useMemo, useState } from "react";
import type { Options, Variants } from "../types";

export interface SortingState {
  currentOption: Options;
  currentVariant: Variants;
}

interface SortingContextValue {
  sortSettings: SortingState;
  updateOption: (option: Options) => void;
  updateVariant: (variant: Variants) => void;
}

export const SortingContext = createContext<SortingContextValue | undefined>(
  undefined,
);

export const SortingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sortSettings, setSortSettings] = useState<SortingState>({
    currentOption: "default",
    currentVariant: "default",
  });

  const updateOption = (option: Options) => {
    setSortSettings((prev) => ({
      ...prev,
      currentOption: option,
    }));
  };

  const updateVariant = (variant: Variants) => {
    setSortSettings((prev) => ({
      ...prev,
      currentVariant: variant,
    }));
  };

  const value = useMemo(
    () => ({
      sortSettings,
      updateOption,
      updateVariant,
    }),
    [sortSettings],
  );

  return (
    <SortingContext.Provider value={value}>{children}</SortingContext.Provider>
  );
};
