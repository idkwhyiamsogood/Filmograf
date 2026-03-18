import { ReactNode } from "react";

import type { Genre } from "@/entities/genres";

interface FilterOptions {
  targetType: TargetType;
  tags?: BaseQuery;
  genres?: BaseQuery;
}

interface BaseQuery {
  exclude: string[];
  include: string[];
}

export interface FilterState {
  strictMatch: boolean;
  filterOptions: FilterOptions;
}

export type TargetType = "movie" | "collection";

export type FilterAction = {
  header: {
    title: string;
    handleReset: () => void;
  };
  body: {
    handleToggeStrict: () => void;
    items: Genre[];
    handleToggleItem: (id: string) => void;
  };
  footer: ReactNode;
};