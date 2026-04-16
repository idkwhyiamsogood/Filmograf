export type SortingType = "option" | "variant";

export interface NewSortingItem {
  type: SortingType;
  label: string;
  value: string;
}

export type SortingItem = NewSortingItem & { id: number }

export type Options =
  | "default"
  | "relevance"
  | "rating"
  | "views"
  | "realeaseDate";
export type Variants = "default" | "descending";

export interface SortingState {
  currentOption: Options;
  currentVariant: Variants;
}
