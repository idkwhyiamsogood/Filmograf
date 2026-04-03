import { ReactNode } from "react";

import type { GenreType } from "@/entities/genres";
import type { EntityType } from "@/shared/types";

export interface FilterOptions {
  targetType: EntityType;
  tags?: BaseQuery;
  genres?: BaseQuery;
  fromYearTo?: string[]; // 1980 - 2000 => 1980 year[0], 2000[1]
  fromGradeTo?: number[];
  ageRating?: number[];
}

interface BaseQuery {
  exclude: string[];
  include: string[];
}

export interface FilterState {
  strictMatch: boolean;
  filterOptions: FilterOptions;
}

export type FilterAction = {
  header: {
    title: string;
    handleReset: () => void;
  };
  body: {
    handleToggeStrict: () => void;
    items: GenreType[];
    handleToggleItem: (id: string) => void;
  };
  footer: ReactNode;
};
