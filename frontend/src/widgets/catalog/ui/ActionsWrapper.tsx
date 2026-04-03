"use client";

// types
import { memo, type FC } from "react";

// ui
import { FilterButton } from "@/features/filter";
import { Search } from "@/features/search";
import { SortingButton } from "@/features/sort";

// hooks
import { useCatalog } from "../model/hooks/useCatalog";

export const ActionsWrapper: FC = memo(() => {
  const { setQuery } = useCatalog();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <FilterButton />
        <SortingButton />
      </div>

      <Search onSearch={setQuery} />
    </div>
  );
});

ActionsWrapper.displayName = "CatalogActionsWrapper";
