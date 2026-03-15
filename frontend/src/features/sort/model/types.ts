type SortingType = "option" | "variant";

interface SortingItemBase {
  type: SortingType;
  label: string;
  value: string;
}

export interface SortingItem extends SortingItemBase {
  id: number;
}

export type NewSortingItem = SortingItemBase;