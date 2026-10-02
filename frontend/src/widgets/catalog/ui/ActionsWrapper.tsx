import { memo, type FC } from "react";

import { FilterButton } from "@/features/filter";
import { Search } from "@/features/search";
import { useSearchParams } from "@/shared/lib/router-compat";

import { useCatalog } from "../model/hooks/useCatalog";

export const ActionsWrapper: FC = memo(() => {
  const { query, setQuery } = useCatalog();
  const params = useSearchParams();

  return (
    <div className="flex items-center gap-2">
      <Search
        onSearch={setQuery}
        defaultValue={query}
        autoFocus={params.get("focus") === "1"}
      />
      <FilterButton />
    </div>
  );
});

ActionsWrapper.displayName = "CatalogActionsWrapper";
